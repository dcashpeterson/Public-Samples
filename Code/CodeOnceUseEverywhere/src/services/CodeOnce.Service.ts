import { PageContext } from "@microsoft/sp-page-context";
import { Client, Environment, Lists } from "../models/models";
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/views";
import { COConfigService } from "./CodeOnce.Config.Service";
import { demoWebUrl } from "../models/const";

export interface ICodeOnceService {
  readonly ready: boolean;
  readonly sp: SPFI;
  readonly pageContext: PageContext;
  webUrl: string;
  Init(serviceScope: ServiceScope): Promise<void>;
  GetItems: (environment: Environment, userId: string) => Promise<Client[]>;
  SaveItem: (item: Client) => Promise<void>;
  UpdateItem: (item: Client) => Promise<void>;
  DeleteItem: (item: Client) => Promise<void>;
}

export class CodeOnceService implements ICodeOnceService {
  private LOG_SOURCE = "🔶 CodeOnceService";
  public static readonly serviceKey: ServiceKey<CodeOnceService> =
    ServiceKey.create<CodeOnceService>(
      "CodeOnceService:ICodeOnceService",
      CodeOnceService
    );
  private _sp: SPFI;
  private _pageContext: PageContext;
  private _ready = false;
  private _webUrl = demoWebUrl;

  public async Init(serviceScope: ServiceScope): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi().using(SPFx({ pageContext: this._pageContext }));
        await COConfigService.Init(serviceScope);
        this._ready = true;
      });
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

  public get pageContext(): PageContext {
    return this._pageContext;
  }

  public get webUrl(): string {
    return this._webUrl;
  }
  public set webUrl(value: string) {
    this._webUrl = value;
    try {
      this._sp = spfi(value).using(SPFx({ pageContext: this._pageContext }));
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (webUrl) - cannot connect to new web - ${err}`
      );
    }
  }

  public async GetItems(environment: Environment, userId?: string): Promise<Client[]> {
    const retVal: Client[] = [];
    try {
      //Get the items from the list.
      //If userId exists filter by user. If not retun everything
      let items: any[];
      switch (environment) {
        case Environment.PERSONALAPP: // running in Personal App
        case Environment.ACE: // running in Personal App
          items = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('Created', false).select('Id', 'Title', 'JobTitle', 'EMail', 'Company', 'WorkAddress', 'WorkCity', 'WorkState', 'WorkZip', 'WorkCountry', 'SalesLead/FirstName', 'SalesLead/LastName', 'SalesLead/ID').expand('SalesLead').filter(`SalesLead/EMail eq '${userId}'`)();
          break;

        case Environment.OFFICE: // running in Office
        case Environment.OUTLOOK: // running in Outlook
        case Environment.TEAM: // running in Teams
        case Environment.SHAREPOINT: // running in SharePoint
        case Environment.LOCALHOST: // running on LocalHost
          items = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('Created', false).select('Id', 'Title', 'JobTitle', 'EMail', 'Company', 'WorkAddress', 'WorkCity', 'WorkState', 'WorkZip', 'WorkCountry', 'SalesLead/FirstName', 'SalesLead/LastName', 'SalesLead/ID').expand('SalesLead')();
          break;
        default:
          throw new Error('Unknown host');
      }

      //Iterate through the items from the list and create Client objects
      items.map((item) => {
        return (
          retVal.push(new Client(
            item.Id,
            item.Title,
            item.JobTitle,
            item.EMail,
            item.Company,
            item.WorkAddress,
            item.WorkCity,
            item.WorkState,
            item.WorkZip,
            item.WorkCountry,
            item.SalesLead.FirstName + " " + item.SalesLead.LastName,
            item.SalesLead.ID))
        );

      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetItems) - ${err.message}`);
    }
    return retVal;
  }

  public async UpdateItem(item: Client): Promise<void> {
    try {
      //let checkboxFieldValues: string[] = [];
      //if (item.choicefieldcheckbox) {
      //  checkboxFieldValues = item.choicefieldcheckbox.split(",");
      //}
      // await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).update({
      //   Title: item.title,
      //   MultiLineText: item.multilinetext,
      //   //Because these are just strings for choice we can 
      //   //Pass a string
      //   ChoiceFieldDDL: item.choicefieldddl,
      //   DateTimeField: item.datetimefield,
      //   ChoiceFieldRadio: item.choicefieldradio,
      //   //A multi-select field needs an array passed as the value
      //   ChoiceFieldCheckbox: checkboxFieldValues,
      //   NumberField: item.numberfield,
      //   CurrencyField: item.currencyfield,
      //   YesNoField: item.yesnofield
      // });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(UpdateItem) - ${err.message}`);
    }
  }

  public async SaveItem(item: Client): Promise<void> {
    try {
      // let checkboxFieldValues: string[] = [];
      // if (item.choicefieldcheckbox) {
      //   checkboxFieldValues = item.choicefieldcheckbox.split(",");
      // }
      // await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.add({
      //   Title: item.title,
      //   MultiLineText: item.multilinetext,
      //   //Because these are just strings for choice we can 
      //   //Pass a string
      //   ChoiceFieldDDL: item.choicefieldddl,
      //   DateTimeField: item.datetimefield,
      //   ChoiceFieldRadio: item.choicefieldradio,
      //   //A multi-select field needs an array passed as the value
      //   ChoiceFieldCheckbox: checkboxFieldValues,
      //   NumberField: item.numberfield,
      //   CurrencyField: item.currencyfield,
      //   YesNoField: item.yesnofield
      // });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(SaveItem) - ${err.message}`);
    }
  }

  public async DeleteItem(item: Client): Promise<void> {
    try {
      //await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).delete();
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(DeleteItem) - ${err.message}`);
    }
  }

}
export const COService = new CodeOnceService();
