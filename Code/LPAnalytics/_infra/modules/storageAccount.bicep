param _location string
param _storageAccountName string
param _storageSKU string

resource _storageAccountResource 'Microsoft.Storage/storageAccounts@2025-01-01' = {
  name: _storageAccountName
  location: _location
  sku: {
    name: _storageSKU
  }
  kind: 'StorageV2'
  properties: {
    defaultToOAuthAuthentication: true
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

resource _storageAccountResource_blob 'Microsoft.Storage/storageAccounts/blobServices@2025-01-01' = {
  parent: _storageAccountResource
  name: 'default'
  properties: {
    containerDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
    cors: {
      corsRules: []
    }
    deleteRetentionPolicy: {
      allowPermanentDelete: false
      enabled: true
      days: 7
    }
  }
}

resource _storageAccountResource_file 'Microsoft.Storage/storageAccounts/fileServices@2025-01-01' = {
  parent: _storageAccountResource
  name: 'default'
  properties: {
    protocolSettings: {
      smb: {}
    }
    cors: {
      corsRules: []
    }
    shareDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

resource _storageAccountResource_queue 'Microsoft.Storage/storageAccounts/queueServices@2025-01-01' = {
  parent: _storageAccountResource
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource _storageAccountResource_table 'Microsoft.Storage/storageAccounts/tableServices@2025-01-01' = {
  parent: _storageAccountResource
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

// Think this gets created later by the azure function, going to see if that's true.
// resource _storageAccountResource_azure_webjobs_hosts 'Microsoft.Storage/storageAccounts/blobServices/containers@2025-01-01' = {
//   parent: _storageAccountResource_blob
//   name: 'azure-webjobs-hosts'
//   properties: {
//     immutableStorageWithVersioning: {
//       enabled: false
//     }
//     defaultEncryptionScope: '$account-encryption-key'
//     denyEncryptionScopeOverride: false
//     publicAccess: 'None'
//   }
// }

output _storageAccountKey string = _storageAccountResource.listKeys().keys[0].value
