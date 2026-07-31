using './main.bicep'

param _devSlot = false
param _consumption = false
param _storageAccountName = 'kecampscusprod'
param _logAnaltyicsWorkspaceName = 'log-kecampsprov-prod-cus'
param _appInsightsName = 'appi-kecampsprov-prod-cus'
param _appServiceName = 'asp-kecampsprov-prod-cus'
param _azureFunctionName = 'func-kecampsprov-prod-cus'
param _ruleLogAlertName = 'rule-kecampsprov-prod-cus'
param _actionGroupsName = 'KECamps Notification Group'
// This Action Group already exists in Azure with real notification receivers configured;
// keep _createActionGroup false so it's only referenced (existing), never upserted.
param _createActionGroup = false
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
param _queues = ['tasksubscription','provisioning-notifications', 'provisioning-complete']
// Names of Storage Paths to create in storage account
param _storagePath = ['provisioning-notifications', 'app-package-${_azureFunctionName}']

// To include CORS origins for Azure Function web
param _additionalOrigins = []

// Parameters that will be unique to the slot
param _appSettingNames = []
// Parameters for each slot by slot name
param _appSettings = {
  prod: {
    APP_NAME: 'SiteProvisioning'
    APP_VERSION: '1.0.0'
    APPINSIGHTS_LOGLEVEL: '0'
    NotificationQueuePath: 'provisioning-notifications'
    CompleteQueuePath: 'provisioning-complete'
    SubscriptionQueuePath: 'tasksubscription'
    SubscriptionFile: 'provisioning-notifications/prov-notification-config.json'
    Tenant: 'kecamps'
    MailAccountId: '4045ae11-e103-4f08-9dc6-32871295d722'
    OrchestryApiEndpoint: 'https://api.orchestry.com/v1/'
    ExampleSite: 'https://kecamps.sharepoint.com/sites/ExampleCampDirectorSite'
    HQSite: 'https://kecamps.sharepoint.com/sites/kecampshq'
    SubscriptionTrackingListName: 'SubscriptionTracking'
    PWNArchiveListName: 'Paperwork We Need'
    SubscriptionName: 'PWN' 
    ListName: 'Weekly To Do List'
    SubscriptionId: 'c479c9ee-ec20-4591-96cc-2b81fb1a198e'
    ResourceGroupName: 'AutomationRG'
    PartnerTopicName: 'PWNList'
    PartnerTopicRegion: 'centralus'
    NotificationFromEmailAddress: 'automation@kecamps.com'
    NotificationToEmailAddress: 'paperwork@kecamps.com'
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
