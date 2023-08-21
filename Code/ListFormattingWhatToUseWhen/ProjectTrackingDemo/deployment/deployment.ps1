$siteUrl = "https://derekcp.sharepoint.com/sites/contentTypeHub"
$siteConnection = Connect-PnPOnline -Url $siteUrl -Interactive


Set-PnPContentType -Identity "Project Hub Progress Tracker" -UpdateChildren -DisplayFormClientSideComponentId "1c55ac03-a3bd-42ad-918a-7d90d703bc18" -EditFormClientSideComponentId "1c55ac03-a3bd-42ad-918a-7d90d703bc18" -NewFormClientSideComponentId "1c55ac03-a3bd-42ad-918a-7d90d703bc18"