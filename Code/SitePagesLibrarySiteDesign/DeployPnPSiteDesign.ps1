$adminSiteUrl = "https://derekcp-admin.sharepoint.com/"

#Set values for Site Script
$title = "Site Pages Script"
$description = "Updated All Pages library to group by Promoted State"
$scriptFile = $PSScriptRoot + "\SitePagesLibrary.json"

#Set values for Site Design
$siteDesignTitle = "Site Pages Site Design";
$siteDesignDescription = "Site design that deploys changes to All Pages view to group by promoted state";

#Connect to SharePoint using Stored Credentials
$creds = Get-PnPStoredCredential -Name O365DevTenant -Type PSCredential
Connect-PnPOnline –Url $adminSiteUrl –Credentials $creds

#Add Site Script to tenant
$fileContents = Get-Content $scriptFile -Raw
$siteScript = Add-PnPSiteScript -Title $title -Description $description -Content $fileContents


$siteScript
#Create the Site Design
Add-PnPSiteDesign -Title $siteDesignTitle -SiteScriptIds $siteScript.Id -Description $siteDesignDescription -WebTemplate CommunicationSite

