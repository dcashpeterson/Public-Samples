# Deploying an Azure Function via GitHub Actions + Bicep (Dev/Prod, OIDC)

This documents the full, validated setup for deploying an Azure Function using Bicep for
infrastructure-as-code, triggered from GitHub Actions. Source control: GitHub. Function host:
Azure. OIDC auth (no client secrets). Every step below reflects what we actually confirmed
working end-to-end, including the fixes for things that looked right but weren't — those are
called out inline as **⚠️ Gotcha** boxes so you don't have to rediscover them.

---

## 1. Repo structure

```
/
├── src/                    # function code
├── infra/
│   ├── main.bicep          # orchestrates the modules
│   ├── main.dev.bicepparam
│   ├── main.prod.bicepparam
│   └── modules/
│       ├── functionApp.bicep
│       ├── storage.bicep
│       └── appInsights.bicep
└── .github/
    └── workflows/
        └── deploy-function.yml
```

The Bicep files themselves are unchanged from an Azure DevOps setup — Bicep doesn't care what's
driving `az deployment group create`.

> **⚠️ Gotcha — workflow file location.** GitHub Actions only executes workflows that live at the
> **repo-root** `.github/workflows/`. If your function app lives in a subdirectory of a monorepo
> (e.g. `Code/YourApp/`), do **not** also keep a copy of the workflow under
> `Code/YourApp/.github/workflows/` — it will silently never run and just drift out of sync with
> the real one. Keep exactly one copy, at the repo root, and point its `template:`/
> `working-directory:` paths into the subdirectory instead (see step 7).

---

## 2. Bicep param files (per environment)

```bicep
// infra/main.dev.bicepparam
using 'main.bicep'

param environmentName = 'dev'
param functionAppName = 'func-yourapp-dev'
param storageAccountSku = 'Standard_LRS'
param appInsightsLocation = 'westeurope'
```

```bicep
// infra/main.prod.bicepparam
using 'main.bicep'

param environmentName = 'prod'
param functionAppName = 'func-yourapp-prod'
param storageAccountSku = 'Standard_GRS'
param appInsightsLocation = 'westeurope'
```

> **⚠️ Gotcha — protecting pre-existing shared resources.** If a module references something as
> `existing` (e.g. an Action Group, a shared Log Analytics workspace) rather than creating it,
> that resource must genuinely already exist in Azure, or the deployment fails deep inside a
> nested module with a hard-to-trace error. Don't assume; verify. If different environments are
> in different states (e.g. dev's placeholder was never created, but prod's real one already
> exists with live config you don't want to overwrite), add a bool param to make creation
> conditional per environment rather than hardcoding one behavior for both:
>
> ```bicep
> param _createActionGroup bool = false
>
> resource actionGroupNew 'microsoft.insights/actionGroups@2024-10-01-preview' = if (_createActionGroup) {
>   name: actionGroupName
>   location: 'Global'
>   properties: { groupShortName: take(actionGroupName, 12) /* max 12 chars */, ... }
> }
> resource actionGroupExisting 'microsoft.insights/actionGroups@2024-10-01-preview' existing = if (!_createActionGroup) {
>   name: actionGroupName
> }
> var actionGroupId = _createActionGroup ? actionGroupNew.id : actionGroupExisting.id
> ```
>
> Set `_createActionGroup = true` only in the `.bicepparam` file(s) where it's actually needed.
>
> **Validate Bicep locally before pushing** — no need to wait on a CI round-trip for syntax
> errors:
> ```bash
> az bicep install   # if not already installed
> az bicep build --file infra/main.bicep --stdout > /dev/null
> az bicep build-params --file infra/main.dev.bicepparam --stdout > /dev/null
> az bicep build-params --file infra/main.prod.bicepparam --stdout > /dev/null
> ```

---

## 3. Create the Entra ID app registration (one-time)

Skip this step if reusing an existing app registration — see step 3a below for how to look up
its App ID instead.

```bash
az ad app create --display-name "gh-actions-<your-function-app-name>"
appId=$(az ad app list --display-name "gh-actions-<your-function-app-name>" --query "[0].appId" -o tsv)

az ad sp create --id $appId
```

### 3a. Finding the App ID for an existing app registration

By display name:
```bash
az ad app list --display-name "your-app-name" --query "[].{name:displayName, appId:appId}" -o table
```

By object ID:
```bash
az ad app show --id <object-id> --query appId -o tsv
```

If the app is multitenant and registered in a different tenant than the subscription you're
deploying into, confirm a service principal exists in the target tenant:

```bash
az ad sp show --id <appId> --query "{appId:appId, displayName:displayName}" -o table
```

If that errors with "not found," provision it in this tenant first:
```bash
az ad sp create --id <appId>
```

---

## 4. Federated credentials (OIDC — no client secret needed)

> **⚠️ Gotcha — subject format must match how the workflow actually authenticates.** GitHub
> computes the OIDC token's `subject` claim differently depending on whether the calling job
> declares an `environment:`:
> - **No `environment:` on the job** → subject is branch-based: `repo:ORG/REPO:ref:refs/heads/<branch>`
> - **Job declares `environment: <name>`** → subject is **environment-based**:
>   `repo:ORG/REPO:environment:<name>`, regardless of which branch triggered it
>
> The workflow in step 7 sets `environment: ${{ needs.resolve-config.outputs.env_name }}` on both
> `deploy-infra` and `deploy-code` — so it needs **environment-based** federated credentials, not
> branch-based ones. Registering branch-based credentials while the workflow uses `environment:`
> produces `AADSTS700213: No matching federated identity record found for presented assertion
> subject 'repo:ORG/REPO:environment:dev'` — the login step fails with a generic
> `auth-type` error message that doesn't mention this directly; the real reason is this line,
> a few lines above it in the log.

Create one federated credential per GitHub Environment your workflow deploys to:

```bash
az ad app federated-credential create --id <APP_ID> --parameters '{
  "name": "github-dev-environment",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:YOUR_ORG/YOUR_REPO:environment:dev",
  "audiences": ["api://AzureADTokenExchange"]
}'

az ad app federated-credential create --id <APP_ID> --parameters '{
  "name": "github-prod-environment",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:YOUR_ORG/YOUR_REPO:environment:prod",
  "audiences": ["api://AzureADTokenExchange"]
}'
```

(If you deliberately design your workflow *without* job-level `environment:`, use the
`ref:refs/heads/<branch>` subject form instead — just make sure step 7's YAML and this step agree
with each other on which form is in play.)

`workflow_dispatch` manual runs are covered automatically under either form — they inherit
whichever branch or environment they're triggered against.

---

## 5. Role assignments

Baseline — Contributor on each resource group the SP deploys into:

```bash
az role assignment create --assignee <APP_ID> --role Contributor \
  --scope /subscriptions/<SUB_ID>/resourceGroups/rg-yourapp-dev

az role assignment create --assignee <APP_ID> --role Contributor \
  --scope /subscriptions/<SUB_ID>/resourceGroups/rg-yourapp-prod
```

> **⚠️ Gotcha — Contributor isn't enough if your Bicep grants RBAC roles.** If any module creates
> a `Microsoft.Authorization/roleAssignments` resource — a common pattern, e.g. granting the
> Function App's managed identity `Storage Blob Data Contributor` on its storage account —
> Contributor alone will fail deep inside that nested deployment with:
> `Authorization failed ... does not have permission to perform action
> 'Microsoft.Authorization/roleAssignments/write'`. Grant the SP an additional, narrowly-scoped
> role to cover it (prefer this over the broader `User Access Administrator`):
>
> ```bash
> az role assignment create \
>   --assignee <APP_ID> \
>   --role "Role Based Access Control Administrator" \
>   --scope /subscriptions/<SUB_ID>/resourceGroups/rg-yourapp-dev
> ```
>
> This is a security-sensitive grant — confirm it's actually needed (check whether your Bicep
> creates any `roleAssignments`) before applying it, and get sign-off if you're not the resource
> owner.

> **Tradeoff noted at the time:** a shared SP across dev and prod means a bug in a dev deploy (or
> a compromised token) has a path to touch prod resources. Acceptable for a low-stakes/pre-launch
> project. For anything with real prod traffic, split into two SPs scoped to their own RG, still
> stored as repo/environment secrets under different names (e.g. `AZURE_CLIENT_ID_DEV` /
> `AZURE_CLIENT_ID_PROD`) and selected via the same resolve-config pattern.

---

## 6. GitHub repo secrets & variables

Repo → **Settings → Secrets and variables → Actions**.

Because the workflow declares `environment:` on its jobs (step 7), GitHub resolves secrets *and*
variables from that **Environment's** scope first (Settings → Environments → `<env>` →
Secrets/Variables), falling back to repository-level only if not found there. For values that
differ by environment (function app name, resource group), set them at the Environment level so
`dev` and `prod` don't collide; for values shared across both (the SP identity), repo-level is
fine.

| Name | Scope | Value |
|---|---|---|
| `AZURE_CLIENT_ID` | Repo (shared) or Environment | the app's `appId` |
| `AZURE_TENANT_ID` | Repo (shared) or Environment | `az account show --query tenantId -o tsv` |
| `AZURE_SUBSCRIPTION_ID` | Repo (shared) or Environment | `az account show --query id -o tsv` |
| `RESOURCE_GROUP` (variable) | Environment | e.g. `rg-yourapp-dev` / `rg-yourapp-prod` |
| `FUNCTION_APP_NAME` (variable) | Environment | e.g. `func-yourapp-dev` / `func-yourapp-prod` |

No client secret, nothing that expires — auth happens via OIDC federation.

> **⚠️ Gotcha — name must match Bicep exactly.** `FUNCTION_APP_NAME` here and
> `functionAppName`/`_azureFunctionName` in the `.bicepparam` file (step 2) must be
> **character-for-character identical**. A mismatch doesn't fail at the Bicep stage (Bicep
> happily creates a site under whatever name the param says) — it fails later, in `deploy-code`,
> with `Resource <name> of type Microsoft.Web/Sites doesn't exist`, because
> `Azure/functions-action@v1` looks up the site by the GitHub variable's value. If you rename one
> side, update the other in the same change.

---

## 7. The GitHub Actions workflow

`.github/workflows/deploy-function.yml`:

```yaml
name: Deploy Azure Function

on:
  push:
    branches: [main, develop]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options: [dev, prod]

permissions:
  id-token: write
  contents: read

jobs:
  resolve-config:
    runs-on: ubuntu-latest
    outputs:
      env_name: ${{ steps.resolve.outputs.env_name }}
    steps:
      - id: resolve
        run: |
          if [ -n "${{ inputs.environment }}" ]; then
            echo "env_name=${{ inputs.environment }}" >> "$GITHUB_OUTPUT"
          elif [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "env_name=prod" >> "$GITHUB_OUTPUT"
          else
            echo "env_name=dev" >> "$GITHUB_OUTPUT"
          fi

  build:
    runs-on: ubuntu-latest
    # Only needed if the function app isn't at the repo root — see the monorepo note below.
    # defaults:
    #   run:
    #     working-directory: Code/YourApp
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '24.x'
          cache: 'npm'
          # cache-dependency-path: Code/YourApp/package-lock.json   # only if in a subdirectory
      - run: |
          npm ci
          npm run build --if-present
      - run: npm prune --omit=dev
      - run: zip -r function-app.zip host.json package.json package-lock.json dist node_modules
      - uses: actions/upload-artifact@v6
        with:
          name: function-app
          path: function-app.zip   # prefix with the subdirectory if not at repo root

  deploy-infra:
    needs: [resolve-config, build]
    runs-on: ubuntu-latest
    environment: ${{ needs.resolve-config.outputs.env_name }}
    steps:
      - uses: actions/checkout@v6

      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy Bicep
        uses: azure/arm-deploy@v2
        with:
          scope: resourcegroup
          resourceGroupName: ${{ vars.RESOURCE_GROUP }}
          template: infra/main.bicep
          parameters: infra/main.${{ needs.resolve-config.outputs.env_name }}.bicepparam
          deploymentName: gh-${{ needs.resolve-config.outputs.env_name }}-${{ github.run_number }}
          failOnStdErr: false

  deploy-code:
    needs: [resolve-config, deploy-infra]
    runs-on: ubuntu-latest
    environment: ${{ needs.resolve-config.outputs.env_name }}
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: function-app

      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy function code
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ vars.FUNCTION_APP_NAME }}
          package: function-app.zip
```

**Job flow:** `resolve-config` figures out which environment to target → `build` compiles and
zips the function code → `deploy-infra` runs the Bicep deployment against the right RG/param file
→ `deploy-code` pushes the compiled zip to the function app. `build` and `resolve-config` run in
parallel; `deploy-infra` waits on both; `deploy-code` waits on `deploy-infra`. `resourceGroupName`
and `app-name` come from GitHub Environment variables (step 6), so nothing environment-specific is
hardcoded in the YAML itself.

**Trigger behavior:** push to `main` → prod, push to `develop` → dev, or run manually via the
Actions tab and pick the environment explicitly.

> **⚠️ Gotcha — the zip must have `host.json` at its root.** Zipping only the contents of your
> build output folder (e.g. `cd dist && zip -r ../function-app.zip .`) omits `host.json`,
> `package.json`, and `node_modules`, which live one level up. Azure's Kudu package validator
> requires `host.json` at the **root** of the zip, and fails with
> `InvalidPackageContentException: Cannot find required host.json file at root level in the .zip
> package` otherwise. Zip from the app's working directory, listing exactly what's needed —
> `host.json package.json package-lock.json dist node_modules` — not the whole directory (which
> would also pull in source `.ts` files, infra Bicep, `tsconfig.json`, etc.). `npm prune
> --omit=dev` beforehand keeps build-only tooling (`typescript`, `@types/*`, etc.) out of the
> shipped `node_modules`.

### Monorepo variant (function app in a subdirectory)

If the function app doesn't live at the repo root (e.g. `Code/YourApp/`):
- Uncomment `defaults.run.working-directory` on the `build` job, pointing at that subdirectory —
  this scopes `npm ci`/`npm run build`/the zip step to it.
- Set `cache-dependency-path` on `setup-node` explicitly to
  `Code/YourApp/package-lock.json` — its cache-restore logic does **not** respect
  `working-directory`, and by default it only checks the **repo root** for a lock file
  (non-recursive), so without this it fails with `Dependencies lock file is not found in
  <workspace root>` even though a real lock file exists one level down.
- Prefix `upload-artifact`'s `path` and the Bicep `template`/`parameters` paths with the
  subdirectory too (artifact and template paths resolve from the workspace root regardless of
  job-level `working-directory`).

---

## 8. Verify

Push to `develop` (or `main`), then check the **Actions** tab.

> **⚠️ Gotcha — `arm-deploy`'s log truncates the real error.** A failed Bicep deployment often
> shows `"...Please see https://aka.ms/arm-deployment-operations for usage details"` and cuts off
> right before the actual cause. Don't guess from the truncated log — if you have `az` CLI
> authenticated to the right subscription (`az account show` to confirm), pull the real error
> directly:
> ```bash
> az deployment operation group list \
>   --resource-group <resource-group> \
>   --name <deploymentName-from-the-log> \
>   -o json
> ```
> Find the entry with `"provisioningState": "Failed"` — `statusMessage.error.details[].message`
> has the actual underlying error, often several levels deeper than what the workflow log shows.

A green `deploy-code` job doesn't guarantee the function actually registered — verify directly:

```bash
az functionapp function list --name <site> --resource-group <rg> -o table
```

If that's empty, check the job's own log (not just `deploy-infra`'s) — `Azure/functions-action`
failures (bad resource name, wrong package content, plan-specific deployment issues) show up
there, not in the Bicep step.

Manual redeploys without a new commit: **Actions → Deploy Azure Function → Run workflow**, select
branch and environment.

---

## 9. Flex Consumption plan — extra notes

If your Function App uses the **Flex Consumption** SKU (`tier: 'FlexConsumption'` in your Bicep
`_sku`/plan resource), a few things behave differently from Consumption/Premium/Dedicated:

- **One site per plan.** Renaming the site name in your `.bicepparam` without removing the old
  site fails with `properties.serverFarmId is invalid. There is already a site linked to the
  specified Flex Consumption serverfarm ... There can only be one site per Flex Consumption
  serverfarm.` Either revert the name to match the existing site, or delete the old one first
  (confirm nothing important is on it: `az functionapp function list --name <old-site>
  --resource-group <rg> -o table`, then `az functionapp delete --name <old-site>
  --resource-group <rg>`).
- **No publish-profile deploys.** `az functionapp deployment list-publishing-profiles` returns
  `"not currently supported for Azure Functions on the Flex Consumption plan"`. This is fine —
  the workflow above already uses the RBAC/OIDC path (`azure/login` before
  `Azure/functions-action`, no `publish-profile` input), which is the supported method.
- **Deployment lands in a blob container, not via classic zip-push.** The package ends up in a
  storage container referenced by `functionAppConfig.deployment.storage.value` on the site
  resource. If functions aren't showing up after a "successful" run, check whether anything's
  actually there:
  ```bash
  az functionapp show --name <site> --resource-group <rg> --query "properties.functionAppConfig" -o json
  az storage blob list --account-name <storage> --container-name app-package-<site> --auth-mode key -o table
  ```
  An empty container means the `deploy-code` job never actually landed a package — go check its
  log, not the infra deployment's.

---

## Open items / not yet implemented

- **What-if on PRs** — a job that runs `az deployment group what-if` and posts the diff as a PR
  comment before merge, for safety review on infra changes. Not yet added.
- **Split SP for isolation** — if prod stakes increase later, revisit the shared-SP tradeoff noted
  in step 5.
