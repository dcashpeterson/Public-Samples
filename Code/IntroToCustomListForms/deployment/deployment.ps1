$siteUrl = "https://derekcp.sharepoint.com/sites/HumanResources"
$siteConnection = Connect-PnPOnline -Url $siteUrl -Interactive


Set-PnPContentType -Identity "Vacation Request" -UpdateChildren -DisplayFormClientSideComponentId "ea00c373-5c20-4c4e-b8e1-57525c0f06c9" -EditFormClientSideComponentId "ea00c373-5c20-4c4e-b8e1-57525c0f06c9" -NewFormClientSideComponentId "ea00c373-5c20-4c4e-b8e1-57525c0f06c9"