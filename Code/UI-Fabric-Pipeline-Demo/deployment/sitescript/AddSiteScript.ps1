

$adminSiteUrl = "https://derekcp-admin.sharepoint.com/"

$siteScriptFile = $PSScriptRoot + "\pipeline-lists-site-script.json"
$webTemplate = "68" #64 = Team Site, 68 = Communication Site, 1 = Groupless Team Site
$siteScriptTitle = "Pipeline Lists Site Script"
$siteDesignTitle = "Pipeline Demo Site Design"
$siteDesignDescription = "Custom Site Design to deploy the lists for the pipeline demo"
$cred = Get-Credential
Connect-SPOService $adminSiteUrl -Credential $cred
$siteScript = (Get-Content $siteScriptFile -Raw | Add-SPOSiteScript -Title $siteScriptTitle) | Select -First 1 Id
Add-SPOSiteDesign -SiteScripts $siteScript.Id -Title $siteDesignTitle -WebTemplate $webTemplate -Description $siteDesignDescription
