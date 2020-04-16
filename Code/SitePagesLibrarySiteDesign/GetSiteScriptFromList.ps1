$adminSiteUrl = "https://derekcp-admin.sharepoint.com/"
$listUrl = "https://derekcp.sharepoint.com/sites/hr-works/SitePages"

#Connect to SharePoint using Stored Credentials
$creds = Get-PnPStoredCredential -Name O365DevTenant -Type PSCredential
Connect-SPOService $adminSiteUrl -Credential $creds

#Get the site script for the list
$extracted = Get-SPOSiteScriptFromList -ListUrl $listUrl


$scriptFile = $PSScriptRoot + "\SitePagesLibrary.json"
Set-Content -Path $scriptFile -Value $extracted


