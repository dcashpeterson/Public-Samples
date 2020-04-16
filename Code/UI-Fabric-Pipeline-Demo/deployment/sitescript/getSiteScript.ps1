$adminUrl = "https://layfieldgroup-admin.sharepoint.com/"

$username = "derek.cash@layfieldgroup.com"
$password = "x6uTAG7K6UJLa"
$securepassword = $password | ConvertTo-SecureString -AsPlainText -Force
$Credentials = New-Object System.Management.Automation.PSCredential -ArgumentList $username, $securepassword

Connect-SPOService $adminUrl -Credential $Credentials
Connect-PnPOnline $adminUrl -Credentials $Credentials
Get-PnPApp

$siteUrl = "https://layfieldgroup.sharepoint.com/sites/DemoSite"
$relativeListUrls = "/Shared Documents", "/FormServerTemplates", "/lists/Events"

#Get-SPOSiteScriptFromWeb –WebUrl $siteUrl -IncludeTheme -IncludeBranding -IncludeSiteExternalSharingCapability –IncludeRegionalSettings -IncludeLinksToExportedItems –IncludedLists $relativeListUrls
