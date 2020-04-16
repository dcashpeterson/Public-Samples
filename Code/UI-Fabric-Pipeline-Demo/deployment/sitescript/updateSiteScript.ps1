$adminUrl = "https://derekcp-admin.sharepoint.com"
$scriptFile = "google-Analytics-Site-Script.json"

$username = "derek@derekcp.onmicrosoft.com"
$password = "6fdwN9AD7vBsk"
$securepassword = $password | ConvertTo-SecureString -AsPlainText -Force
$Credentials = New-Object System.Management.Automation.PSCredential -ArgumentList $username, $securepassword


Connect-SPOService $adminUrl -Credential $Credentials

Set-PnPSiteScript -Identity 81264ab2-6d60-4d86-9394-14b19342377d -Content (Get-Content $scriptFile -Raw)
