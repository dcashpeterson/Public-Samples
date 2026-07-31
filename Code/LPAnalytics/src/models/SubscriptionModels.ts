// export interface Response
// {
//   value: Notification[];
// }

/* Notification model 
 * subscriptionId: string - The subscription ID that the notification is for.
  * clientState: string - The client state that was sent with the subscription.
  * expirationDateTime: Date - The expiration date and time of the subscription.
  * resource: string - The list id that the subscription is for.
  * tenantId: string - The tenant ID that the subscription is for.
  * siteUrl: string - The site URL that the subscription is for.
  * webId: string - The web ID that the subscription is for.
*/
// export interface Notification
// {
//   subscriptionId: string;
//   clientState: string;
//   expirationDateTime: Date;
//   resource: string;
//   tenantId: string;
//   siteUrl: string;
//   webId: string;
// }

export interface SubscriptionConfig {
  subscriptionId: string;
  expirationDateTime: string;
  lastToken: string;
  //siteUrl: string;
  graphResource: string;
}


/**
 * Example Data
 * odata.type: "#Microsoft.Graph.Group"
 * odata.id: "Groups/cf653542-be15-4568-87d4-37613d8a21f5"
 * organizationId: same as tenant id
 */

export interface IEGResourceData {
  "@odata.type": string;
  "@odata.id": string;
  id: string;
  organizationId: string;
  "members@delta": [];
}

/**
 * Example Data
 * changeType: "updated"
 * resource: "Groups/cf653542-be15-4568-87d4-37613d8a21f5"
 */
export interface IEGData {
  changeType: string;
  clientState: string;
  resource: string;
  resourceData: IEGResourceData;
  subscriptionExpirationDateTime: string;
  subscriptionId: string;
  tenantId: string;
  lifecycleEvent?: string;
  organizationId?: string;
}


/**
 * Example Data
 * type: "Microsoft.Graph.ListItemUpdated"
 * source: "/tenants/46474cf3-2a42-4ac0-a447-bc5997157660/applications/de8bc8b5-d9f9-48b1-a8ad-b748da725064"
 * subject: "Groups/cf653542-be15-4568-87d4-37613d8a21f5"
 */
export interface IEGNotification {
  type: string;
  specversion: string;
  source: string;
  subject: string;
  id: string;
  time: string;
  datacontenttype: string;
  data: IEGData;
}
