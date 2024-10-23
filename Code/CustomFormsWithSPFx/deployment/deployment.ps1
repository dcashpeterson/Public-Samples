$siteUrl = "https://sympdcp.sharepoint.com/sites/HomeLoanApplication"
$siteConnection = Connect-PnPOnline -Url $siteUrl -Interactive -ClientId ddaf4f32-d882-416e-8be6-b502acc66e24


Set-PnPContentType -Identity "LoanApplication" -UpdateChildren -DisplayFormClientSideComponentId "3fb341a2-e408-42e4-85d1-b131eeb6efb3" -EditFormClientSideComponentId "3fb341a2-e408-42e4-85d1-b131eeb6efb3" -NewFormClientSideComponentId "3fb341a2-e408-42e4-85d1-b131eeb6efb3"