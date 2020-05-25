$adminUrl = "https://derekcp-admin.sharepoint.com"
 
$creds = Get-PnPStoredCredential -Name O365DevTenant -Type PSCredential
Connect-SPOService $adminUrl -Credential $creds

Get-SPOSiteScript

Remove-SPOSiteScript -Identity "13ea3b96-fe1e-47f3-ba9f-0308338d2e8c"
#Remove-SPOSiteScript -Identity "fc681081-7349-49d7-a923-fc123a2251b7"
#Remove-SPOSiteScript -Identity "e84a97b2-e07c-4d85-a297-a708135ae12f"
#Remove-SPOSiteScript -Identity "5563fb08-6273-4b45-8313-8248bb526efb"

#Get-SPOSiteScript

#Id                  : 5563fb08-6273-4b45-8313-8248bb526efb
#Title               : Site Pages Script

Get-SPOSiteDesign

Remove-SPOSiteDesign -Identity "fb260d47-6e7b-4449-b9be-6d3cfbb55d3f"
#Remove-SPOSiteDesign -Identity "814bd07f-2a4b-4951-9dc5-b8792dce1b54"
#Remove-SPOSiteDesign -Identity "ddda9d93-8c2f-4ccf-9c6b-c964d4d2b9d5"
#Remove-SPOSiteDesign -Identity "a99fdd77-a519-4000-9410-aaf612b6dfd1"
#Remove-SPOSiteDesign -Identity "2748ac64-d13e-4131-bccd-f83c1665ee79"
#Remove-SPOSiteDesign -Identity "2206f78d-0608-43d4-afde-f2ea71e8d3e2"

