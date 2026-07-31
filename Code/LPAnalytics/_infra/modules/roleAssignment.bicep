param _principalId string 
param _roleDefId string

var roleAssignmentName= guid(_principalId, _roleDefId, resourceGroup().id)

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: roleAssignmentName
  properties: {
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', _roleDefId)
    principalId: _principalId
  }
}
