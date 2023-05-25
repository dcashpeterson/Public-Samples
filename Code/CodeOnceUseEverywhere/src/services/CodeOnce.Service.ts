import { PageContext } from "@microsoft/sp-page-context";
import { Choice, Client, Environment, Lists } from "../models/models";
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { GraphFI, graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/views";
import "@pnp/sp/site-users/web";
import "@pnp/graph/groups";
import "@pnp/graph/members";
import { COConfigService } from "./CodeOnce.Config.Service";
import { demoWebUrl } from "../models/const";
import { ISiteUser } from "@pnp/sp/site-users/types";
import { WebPartContext } from "@microsoft/sp-webpart-base";


export interface ICodeOnceService {
  readonly ready: boolean;
  readonly sp: SPFI;
  readonly pageContext: PageContext;
  webUrl: string;
  PipelineChoices: Choice[];
  Init(serviceScope: ServiceScope, aadToken: any): Promise<void>;
  GetItems: (environment: Environment, userId: string) => Promise<Client[]>;
  SaveItem: (item: Client) => Promise<void>;
  UpdateItem: (item: Client) => Promise<void>;
  DeleteItem: (id: number) => Promise<void>;
}

export class CodeOnceService implements ICodeOnceService {
  private LOG_SOURCE = "🔶 CodeOnceService";
  public static readonly serviceKey: ServiceKey<CodeOnceService> =
    ServiceKey.create<CodeOnceService>(
      "CodeOnceService:ICodeOnceService",
      CodeOnceService
    );
  private _sp: SPFI;
  private _graph: GraphFI;
  private _pageContext: PageContext;
  private _context: WebPartContext;
  private _ready = false;
  private _webUrl = demoWebUrl;
  private _currentUser: ISiteUser;
  private _pipelineChoices: Choice[] = [];

  public async Init(serviceScope: ServiceScope, context: WebPartContext): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi(this._webUrl).using(spSPFx({ pageContext: this._pageContext }));
        this._graph = graphfi().using(graphSPFx(context));
      });
      await COConfigService.Init(serviceScope);
      this._ready = true;
      this._currentUser = await this._getCurrentUser();
      this._context = context;
      this._pipelineChoices = await this._getChoiceFieldValues("PipelineStatus");
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (init) - ${err}`);
    }
  }
  public get ready(): boolean {
    return this._ready;
  }

  public get sp(): SPFI {
    return this._sp;
  }

  public get graph(): GraphFI {
    return this._graph;
  }

  public get pageContext(): PageContext {
    return this._pageContext;
  }

  public get currentUser(): any {
    return this._currentUser;
  }

  public get webUrl(): string {
    return this._webUrl;
  }
  public set webUrl(value: string) {
    //this._webUrl = value;
    console.log("hi");
    try {
      this._sp = spfi(this._webUrl).using(spSPFx({ pageContext: this._pageContext }));
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (webUrl) - cannot connect to new web - ${err}`
      );
    }
  }
  public get PipelineChoices(): Choice[] {
    return this._pipelineChoices;
  }

  public async GetItems(environment: Environment, userId?: string): Promise<Client[]> {
    const retVal: Client[] = [];
    try {
      //If userId exists filter by user. If not retun everything
      let filter = "";
      switch (environment) {
        case Environment.PERSONALAPP: // running in Personal App
        case Environment.ACE: // running in Personal App
          filter = `SalesLead/ID eq '${userId}'`
          break;
        case Environment.TEAM: // running in Teams
          const teamsContext = await this._context.sdks?.microsoftTeams.teamsJs.app.getContext();
          const members = await this._getTeamMemeberIDs(teamsContext.team?.groupId);
          members.map((member, index) => {
            filter += `SalesLead/EMail eq '${member}'`
            if (index < members.length - 1) {
              filter += " or "
            }
          });
          break;
        case Environment.OFFICE: // running in Office
        case Environment.OUTLOOK: // running in Outlook
        case Environment.SHAREPOINT: // running in SharePoint
        case Environment.LOCALHOST: // running on LocalHost

          break;
        default:
          throw new Error('Unknown host');
      }
      //Get the items from the list.
      const items = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('LastContactDate', false).select('Id', 'CompanyName', 'ContactName', 'ContactTitle', 'ContactEmail', 'ContactPhone', 'ProjectName', 'ProjectDescription', 'PipelineStatus', 'LastContactDate', 'SalesLead/FirstName', 'SalesLead/LastName', 'SalesLead/ID').expand('SalesLead').filter(filter)();
      //Iterate through the items from the list and create Client objects
      items.map((item) => {
        return (
          retVal.push(new Client(
            item.Id,
            item.CompanyName,
            item.ContactName,
            item.ContactTitle,
            item.ContactEmail,
            item.ContactPhone,
            item.ProjectName,
            item.ProjectDescription,
            item.SalesLead.FirstName + " " + item.SalesLead.LastName,
            item.SalesLead.ID,
            item.PipelineStatus,
            item.LastContactDate))
        );

      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetItems) - ${err.message}`);
    }
    return retVal;
  }

  public async UpdateItem(item: Client): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).update({
        CompanyName: item.companyName,
        ContactName: item.contactName,
        ContactTitle: item.contactTitle,
        ContactEmail: item.contactEmail,
        ContactPhone: item.contactPhone,
        ProjectName: item.projectName,
        ProjectDescription: item.projectDescription,
        SalesLeadId: item.salesLeadId,
        PipelineStatus: item.pipelineStatus,
        LastContactDate: new Date().toISOString()
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(UpdateItem) - ${err.message}`);
    }
  }

  public async SaveItem(item: Client): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.add({
        CompanyName: item.companyName,
        ContactName: item.contactName,
        ContactTitle: item.contactTitle,
        ContactEmail: item.contactEmail,
        ContactPhone: item.contactPhone,
        ProjectName: item.projectName,
        ProjectDescription: item.projectDescription,
        SalesLeadId: item.salesLeadId,
        PipelineStatus: item.pipelineStatus,
        LastContactDate: new Date().toISOString()
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(SaveItem) - ${err.message}`);
    }
  }

  public async DeleteItem(id: number): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(id).delete();
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(DeleteItem) - ${err.message}`);
    }
  }

  private async _getCurrentUser(): Promise<ISiteUser> {
    let retVal;
    try {
      retVal = await this._sp.web.currentUser();
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(DeleteItem) - ${err.message}`);
    }
    return retVal;
  }

  //Use the graph to get the members of the team and return their email addresses
  private async _getTeamMemeberIDs(groupId: string): Promise<string[]> {
    const retVal: string[] = [];
    try {
      const members = await this._graph.groups.getById(groupId).members();

      members.map((member) => {
        return (retVal.push(member.mail));
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getTeamMemeberIDs) - ${err.message}`);
    }
    return retVal;
  }

  private async _getChoiceFieldValues(fieldName: string): Promise<Choice[]> {
    const retVal: Choice[] = [];
    try {
      const choiceField = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).fields.getByInternalNameOrTitle(fieldName)();
      choiceField.Choices.map((choice: string) => {
        retVal.push(new Choice(choice, choice));
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getChoiceFieldValues) - ${err.message}`);
    }
    return retVal;
  }
}
export const COService = new CodeOnceService();
