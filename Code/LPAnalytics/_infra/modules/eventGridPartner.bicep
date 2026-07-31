param baseTime string = utcNow('u')

var authorizationExpirationTimeInUtc = dateTimeAdd(baseTime, 'P1Y')

resource eventGridPartnerConfiguration 'Microsoft.EventGrid/partnerConfigurations@2025-02-15' = {
  location: 'global'
  name: 'default'
  properties: {
    partnerAuthorization: {
      defaultMaximumExpirationTimeInDays: 365
      authorizedPartnersList: [
        {
          partnerName: 'MicrosoftGraphAPI'
          partnerRegistrationImmutableId: 'c02e0126-707c-436d-b6a1-175d2748fb58'
          authorizationExpirationTimeInUtc: authorizationExpirationTimeInUtc
        }
      ]
    }
  }
}
