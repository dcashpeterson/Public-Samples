$adminUrl = "https://layfieldgroup-admin.sharepoint.com/"
$siteDesignTitle = "The Loop Site Design"
$desc = "Site design that provisions a communications site for The Loop"
$webTemp = "68"

$username = "derek.cash@layfieldgroup.com"
$password = "x6uTAG7K6UJLa"
$securepassword = $password | ConvertTo-SecureString -AsPlainText -Force
$Credentials = New-Object System.Management.Automation.PSCredential -ArgumentList $username, $securepassword


Connect-SPOService $adminUrl -Credential $Credentials

Add-SPOSiteDesign -SiteScripts f590341a-fa1b-46e0-b69f-67845e83ad85 -Title $siteDesignTitle -WebTemplate $webTemp -Description $desc
