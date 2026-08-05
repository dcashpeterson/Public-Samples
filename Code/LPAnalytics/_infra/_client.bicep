param _devSlot bool
param _storageAccountName string
param _appInsightsConnection string
@secure()
param _storageAccountKey string
param _azureFunctionName string
param _azureFunctionProdManagedIdentity string
param _azureFunctionDevManagedIdentity string = ''
param _appSettingNames array
param _appSettings object
param _queues array
param _storagePath array
param _tables array
param _currentVersion string
param _consumption bool
// Create Blob Containers

@description('Create Blob Containers')
resource _storageAccountResource 'Microsoft.Storage/storageAccounts@2023-05-01' existing = {
  name: _storageAccountName
}

resource _storageAccountResource_blob 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' existing = {
  parent: _storageAccountResource
  name: 'default'
}

resource _storageAccount_blobContainerProd 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = [for name in _storagePath: {
  parent: _storageAccountResource_blob
  name: '${name}'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'None'
  }
}]

// Create Queues

@description('Create Queues')
resource _storageAccountResource_queue 'Microsoft.Storage/storageAccounts/queueServices@2023-05-01' existing = {
  parent: _storageAccountResource
  name: 'default'
}

resource _storageAccount_queueProd 'Microsoft.Storage/storageAccounts/queueServices/queues@2023-05-01' = [for name in _queues: {
  parent: _storageAccountResource_queue
  name: '${name}'
}]

// Create Tables

@description('Create Tables')
resource _storageAccountResource_table 'Microsoft.Storage/storageAccounts/tableServices@2023-05-01' existing = {
  parent: _storageAccountResource
  name: 'default'
}

resource _storageAccount_tableProd 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = [for name in _tables: {
  parent: _storageAccountResource_table
  name: '${name}'
}]

var BASE_SLOT_APPSETTINGS = {
  APPLICATIONINSIGHTS_CONNECTION_STRING: _appInsightsConnection
  AZURE_STORAGE_ACCOUNT_NAME: _storageAccountName
  AzureWebJobsStorage: 'DefaultEndpointsProtocol=https;AccountName=${_storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${_storageAccountKey}'
  FUNCTIONS_NODE_BLOCK_ON_ENTRY_POINT_ERROR: true
  WEBSITES_ENABLE_APP_SERVICE_STORAGE: false
}

// FUNCTIONS_NODE_BLOCK_ON_ENTRY_POINT_ERROR only needed for node.js <=v18 
var CONSUMPTION_APPSETTINGS = (_consumption)?{
  FUNCTIONS_WORKER_RUNTIME: 'node'
}:{}

// Override current version
var CURRENT_VERSION = {
  APP_VERSION: _currentVersion
}

resource azFunctionApp 'Microsoft.Web/sites@2021-03-01' existing = {
  name: _azureFunctionName
}

resource functionSlotConfig 'Microsoft.Web/sites/config@2021-03-01' = {
  name: 'slotConfigNames'
  parent: azFunctionApp
  properties: {
    appSettingNames: _appSettingNames
  }
}

@description('Set app settings on production slot')
resource functionAppProdSettings 'Microsoft.Web/sites/config@2021-03-01' = {
  name: 'appsettings'
  parent: azFunctionApp
  properties: union(BASE_SLOT_APPSETTINGS, CONSUMPTION_APPSETTINGS, _appSettings.prod, CURRENT_VERSION)
}

resource _azureFunctionSlotResource 'Microsoft.Web/sites/slots@2023-12-01' existing = if (_devSlot) {
  parent: azFunctionApp
  name: 'dev'
}

@description('Set app settings on production slot')
resource functionAppDevSettings 'Microsoft.Web/sites/slots/config@2021-03-01' = if (_devSlot) {
  name: 'appsettings'
  parent: _azureFunctionSlotResource
  properties: union(BASE_SLOT_APPSETTINGS, CONSUMPTION_APPSETTINGS, _appSettings.dev, CURRENT_VERSION)
}

// Assign Role Def
var StorageBlobDataContributor = 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
module storageRoleAssignProd 'modules/roleAssignment.bicep' = {
  name: 'storageRoleAssignProd'
  params: {
    _principalId: _azureFunctionProdManagedIdentity
    _roleDefId: StorageBlobDataContributor
  }
}

module storageRoleAssignDev 'modules/roleAssignment.bicep' = if (_devSlot) {
  name: 'storageRoleAssignDev'
  params: {
    _principalId: _azureFunctionDevManagedIdentity
    _roleDefId: StorageBlobDataContributor
  }
}

var StorageTableDataContributor = '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3'
module storageTableRoleAssignProd 'modules/roleAssignment.bicep' = {
  name: 'storageTableRoleAssignProd'
  params: {
    _principalId: _azureFunctionProdManagedIdentity
    _roleDefId: StorageTableDataContributor
  }
}

module storageTableRoleAssignDev 'modules/roleAssignment.bicep' = if (_devSlot) {
  name: 'storageTableRoleAssignDev'
  params: {
    _principalId: _azureFunctionDevManagedIdentity
    _roleDefId: StorageTableDataContributor
  }
}

module eventGridPartner 'modules/eventGridPartner.bicep' = {
  name: 'eventGridPartner'
}
