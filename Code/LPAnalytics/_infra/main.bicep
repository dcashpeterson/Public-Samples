param _location string = resourceGroup().location
param _devSlot bool = false
param _consumption bool = true
param _storageAccountName string
param _storageSKU string
param _logAnaltyicsWorkspaceName string
param _appInsightsName string
param _appServiceName string
param _azureFunctionName string
param _ruleLogAlertName string
param _actionGroupsName string
param _nodeVersion string
param _alwaysOn bool
param _sku object
param _appSettings object
param _appSettingNames array
param _queues array
param _storagePath array
param _currentVersion string
param _additionalOrigins array = []

// Create Storage Account
module storageAccountResource 'modules/storageAccount.bicep' = {
  name: 'storageAccountResource'
  params: {
    _location: _location
    _storageAccountName: _storageAccountName
    _storageSKU: _storageSKU
  }
}

// Create Analytics
module analtyicsResource 'modules/logAnalytics.bicep' = {
  name: 'logAnalyticsResource'
  params: {
    _location: _location
    _logAnaltyicsWorkspaceName: _logAnaltyicsWorkspaceName
    _appInsightsName: _appInsightsName
    _ruleLogAlertName: _ruleLogAlertName
    _actionGroupsName: _actionGroupsName
  }
}

module appServiceAFResource 'modules/appServiceAF.bicep' = {
  name: 'appServiceAFResource'
  params: {
    _location: _location
    _appServiceName: _appServiceName
    _azureFunctionName: _azureFunctionName
    _alwaysOn: _alwaysOn
    _sku: _sku
    _consumption: _consumption
    _storageAccountName: _storageAccountName
    _additionalOrigins: _additionalOrigins
    _nodeVersion: _nodeVersion
  }
}

module afDevSlot 'modules/afDevSlot.bicep' = if (_devSlot) {
  name: 'afDevSlot'
  params: {
    _location: _location
    _appServiceId: appServiceAFResource.outputs._appServicePlanExternalId
    _azureFunctionName: _azureFunctionName
    _nodeVersion: _nodeVersion
  }
  dependsOn: [storageAccountResource]
}

module clientSettings '_client.bicep' = {
  name: 'clientSettings'
  params: {
    _devSlot: _devSlot
    _storageAccountName: _storageAccountName
    _appInsightsConnection: analtyicsResource.outputs._appInsightsConnection
    _storageAccountKey: storageAccountResource.outputs._storageAccountKey
    _azureFunctionName: _azureFunctionName
    _azureFunctionProdManagedIdentity: appServiceAFResource.outputs._azureFunctionManagedIdentity
    _azureFunctionDevManagedIdentity: (_devSlot) ? afDevSlot.outputs._azureFunctionManagedIdentity : ''
    _appSettings: _appSettings
    _appSettingNames: _appSettingNames
    _queues: _queues
    _storagePath: _storagePath
    _currentVersion: _currentVersion
    _consumption: _consumption
  }
  dependsOn: []
}

output azureFunctionUrl string = appServiceAFResource.outputs._azureFunctionUrl
output azureFunctionProdManagedIdentity string = appServiceAFResource.outputs._azureFunctionManagedIdentity
output azureFunctionDevManagedIdentity string = (_devSlot) ? afDevSlot.outputs._azureFunctionManagedIdentity : ''

