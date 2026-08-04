using './main.bicep'

param _devSlot = false
param _consumption = false
param _storageAccountName = 'lpanalyticsdev'
param _logAnaltyicsWorkspaceName = 'log-lpanalytics-dev'
param _appInsightsName = 'appi-lpanalytics-dev'
param _appServiceName = 'asp-lpanalytics-dev'
param _azureFunctionName = 'func-lp-analytics-dev'
param _ruleLogAlertName = 'rule-lpanalytics-dev'
param _actionGroupsName = 'ag-lpanalytics-dev'
// Dev's Action Group doesn't pre-exist in Azure, so have this deployment create it.
param _createActionGroup = true
param _nodeVersion = '24'

// Storage Type
//   Standard_RAGRS - Read Access Globally Redundant Storage
//   Standard_LRS - Locally Redundant Storage
param _storageSKU = 'Standard_RAGRS'

// AlwaysOn = False for consumption, True for premium
param _alwaysOn = false
param _sku = {
  name: 'FC1'
  tier: 'FlexConsumption'
  size: 'FC1'
  family: 'FC'
  capacity: 0
}
param _currentVersion = '1.0.0'

// Names of Queues to create in storage account
param _queues = ['lpanalytics','lpanalytics-notifications','lpanalytics-complete']
// Names of Storage Paths to create in storage account
param _storagePath = ['lpanalytics-notifications-dev', 'app-package-${_azureFunctionName}']
// Names of Tables to create in storage account
param _tables = ['lpanalyticstracking', 'lpassets']

// To include CORS origins for Azure Function web
param _additionalOrigins = []

// Parameters that will be unique to the slot
param _appSettingNames = []
// Parameters for each slot by slot name
param _appSettings = {
  prod: {
    APP_NAME: 'LPAnlaytics-DEV'
    APP_VERSION: '1.0.0'
    APPINSIGHTS_LOGLEVEL: '0'
    NotificationQueuePath: 'lpanalytics-notifications'
    CompleteQueuePath: 'lpanalytics-complete'
    Tenant: 'sympdcp'
    MailAccountId: 'be54dfb7-6095-49d4-8679-b8872a8bfdaa'
    AnalyticsSite: 'https://sympdcp.sharepoint.com/sites/LearningPathwaysAnalytics'
    ListName: 'Analytics Tracking'
    NotificationFromEmailAddress: 'derekcp@sympraxisconsulting.com'
    NotificationToEmailAddress: 'derekcp@sympraxisconsulting.com'
  }
  dev: {}
}

// param _premiumSku object = {
//   name: 'P1v3'
//   tier: 'PremiumV3'
//   size: 'P1v3'
//   family: 'Pv3'
//   capacity: 1
// }

// param _consumptionSku object = {
//   name: 'Y1'
//   tier: 'Dynamic'
//   size: 'Y1'
//   family: 'Y'
//   capacity: 0
// }

// param _flexConsumptionSku object = {
//   name: 'FC1'
//   tier: 'FlexConsumption'
//   size: 'FC1'
//   family: 'FC'
//   capacity: 0
// }
