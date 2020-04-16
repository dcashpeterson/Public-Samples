$adminUrl = "https://layfieldgroup-admin.sharepoint.com/"

$username = "derek.cash@layfieldgroup.com"
$password = "x6uTAG7K6UJLa"
$securepassword = $password | ConvertTo-SecureString -AsPlainText -Force
$Credentials = New-Object System.Management.Automation.PSCredential -ArgumentList $username, $securepassword

$siteScriptFile = "google-Analytics-Site-Script.json"

Connect-PnPOnline -Url $adminUrl -Credential $Credentials

$fileContents = Get-Content $siteScriptFile -Raw

Set-PnPSiteScript -Identity f590341a-fa1b-46e0-b69f-67845e83ad85 -Content $fileContents

Get-PnPApp
#Remove-SPOSiteDesign 7eed93d1-22ce-4fcd-aac3-66a7142f9935

Get-SPOSiteDesign