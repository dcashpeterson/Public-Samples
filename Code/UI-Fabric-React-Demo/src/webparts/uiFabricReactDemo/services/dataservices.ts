import { Opportunity, Contact, Client } from "../models/IOpportunity";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
// this imports the functionality for lists associated only with web
import "@pnp/sp/lists/web";
import { Logger, LogLevel } from "@pnp/logging";
import * as lodash from "lodash";

export interface IOpportunityDataService {
  context: WebPartContext;
  getOpportunities(web): Promise<Opportunity[]>;
}

export class OpportunityDataService implements IOpportunityDataService {
  public context: WebPartContext;

  private LOG_SOURCE = "OpportunitiesDataService";

  private fieldOptions = {
    headers: { Accept: "application/json;odata.metadata=none" }
  };

  constructor(context: WebPartContext) {
    this.context = context;
  }

  public async getOpportunities(web) {
    let returnValue: Opportunity[] = [];
    try {
      let items: Opportunity[] = [];
      let tempItems: any[];
      let clientItems: any[];
      tempItems = await sp.web.lists.getByTitle("Projects").items.select("ID", "Title", "ProjectDescription", "Client/ID", "Client/Title", "EngagementManager/FirstName", "EngagementManager/LastName", "EngagementManager/UserName", "PipelineStatus", "LastContactDate", "NextContactDate", "ContactName", "ContactTitle", "WorkPhone").expand("EngagementManager", "Client").usingCaching().get();
      clientItems = await sp.web.lists.getByTitle("Clients").items.select("Title", "ID", "Company_x0020_Address", "WorkCity", "WorkState", "WorkZip", "WorkPhone").usingCaching().get();
      if (tempItems.length > 0) {
        tempItems.map((i, index) => {
          let opportunity: Opportunity = new Opportunity();
          opportunity.id = i.ID;
          opportunity.projectTitle = i.Title;
          opportunity.projectDescription = i.ProjectDescription;
          opportunity.engagementManager = i.EngagementManager.FirstName + " " + i.EngagementManager.LastName;
          opportunity.status = i.PipelineStatus;

          let date = new Date(i.LastContactDate);
          opportunity.lastContactDate = date;
          date = new Date(i.NextContactDate);
          opportunity.nextContactDate = date;

          let contact = new Contact();
          contact.name = i.ContactName;
          contact.title = i.ContactTitle;
          contact.phone = i.WorkPhone;

          if (contact != null) {
            opportunity.contact = contact;
          }

          if (i.Client.ID != null) {
            let client = new Client();
            let clientItem = lodash.filter(clientItems, { "ID": i.Client.ID });
            if (clientItem.length > 0) {
              client.id = clientItem[0].Id;
              client.name = clientItem[0].Title;
              client.address = clientItem[0].Company_x0020_Address;
              client.city = clientItem[0].WorkCity;
              client.state = clientItem[0].WorkState;
              client.state = clientItem[0].WorkZip;
              client.phone = clientItem[0].WorkPhone;
            }
            opportunity.client = client;
          }
          items.push(opportunity);
        });
        returnValue = items;
      }



    } catch (err) {
      Logger.write(`${err} - ${this.LOG_SOURCE} (IsReady)`, LogLevel.Error);
      returnValue = [];
    }

    return returnValue;
  }

  public async getClient(id: number) {
    let returnValue = null;

    return returnValue;
  }


}