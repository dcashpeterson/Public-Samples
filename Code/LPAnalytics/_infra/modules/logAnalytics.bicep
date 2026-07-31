param _location string
param _logAnaltyicsWorkspaceName string
param _appInsightsName string
param _actionGroupsName string 
param _ruleLogAlertName string

resource _logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: _logAnaltyicsWorkspaceName
  location: _location
  properties: {
    sku: {
      name: 'pergb2018'
    }
    retentionInDays: 30
    features: {
      legacy: 0
      searchVersion: 1
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    workspaceCapping: {
      dailyQuotaGb: -1
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource _appInsightsResource 'microsoft.insights/components@2020-02-02' = {
  name: _appInsightsName
  location: _location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Redfield'
    Request_Source: 'IbizaAIExtension'
    RetentionInDays: 90
    WorkspaceResourceId: _logAnalyticsWorkspace.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource _actionGroupsResource 'microsoft.insights/actionGroups@2024-10-01-preview' existing = {
  name: _actionGroupsName
}

// resource _actionGroupsResource 'microsoft.insights/actionGroups@2024-10-01-preview' = {
//   name: _actionGroupsName
//   location: 'Global'
//   properties: {
//     groupShortName: _actionGroupsName
//     enabled: true
//     emailReceivers: [
//       {
//         name: 'SympraxisNotification_-EmailAction-'
//         emailAddress: 'julie.turner@sympraxisconsulting.com'
//         useCommonAlertSchema: false
//       }
//     ]
//     smsReceivers: []
//     webhookReceivers: []
//     eventHubReceivers: []
//     itsmReceivers: []
//     azureAppPushReceivers: []
//     automationRunbookReceivers: []
//     voiceReceivers: []
//     logicAppReceivers: []
//     azureFunctionReceivers: []
//     armRoleReceivers: []
//   }
// }

resource _ruleLogAlertResource 'microsoft.insights/scheduledqueryrules@2025-01-01-preview' = {
  name: _ruleLogAlertName
  location: 'eastus'
  kind: 'LogAlert'
  properties: {
    displayName: _ruleLogAlertName
    severity: 1
    enabled: true
    evaluationFrequency: 'PT5M'
    scopes: [
      _appInsightsResource.id
    ]
    targetResourceTypes: [
      'microsoft.insights/components'
    ]
    windowSize: 'PT5M'
    criteria: {
      allOf: [
        {
          query: 'traces | where severityLevel in ("3", "4") | union exceptions'
          timeAggregation: 'Count'
          dimensions: []
          operator: 'GreaterThan'
          threshold: json('1')
          failingPeriods: {
            numberOfEvaluationPeriods: 1
            minFailingPeriodsToAlert: 1
          }
        }
      ]
    }
    autoMitigate: false
    actions: {
      actionGroups: [
        _actionGroupsResource.id
      ]
      customProperties: {}
      actionProperties: {}
    }
  }
}

output _appInsightsResourceId string = _appInsightsResource.id
output _appInsightsConnection string = _appInsightsResource.properties.ConnectionString
