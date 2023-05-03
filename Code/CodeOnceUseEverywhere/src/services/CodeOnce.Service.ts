import { PageContext } from "@microsoft/sp-page-context";
import { Client, Environment, IFieldList, ListFields, Lists } from "../models/models";
import { CalendarType, DateTimeFieldFormatType, DateTimeFieldFriendlyFormatType, UrlFieldFormatType } from "@pnp/sp/fields";
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/views";
import { IView } from "@pnp/sp/views";

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
  private _webUrl = "";

  public async Init(serviceScope: ServiceScope): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi().using(SPFx({ pageContext: this._pageContext }));
        this._ready = true;
        await this._configList(Lists.DEMOITEMSLIST, "", ListFields);
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

  public async _configList(
    listName: string,
    listDescription: string,
    fieldList: IFieldList[]
  ): Promise<boolean> {
    let retVal = false;
    try {
      const list = await this._sp.web.lists.ensure(listName, listDescription, 100, false, { OnQuickLaunch: true });
      if (list.created) {
        for (let i = 0; i < fieldList.length; i++) {
          if (fieldList[i].props.FieldTypeKind === 2) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addText(fieldList[i].name);
          } else if (fieldList[i].props.FieldTypeKind === 3) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.createFieldAsXml(
                `<Field Type="Note" Name="${fieldList[i].name}" DisplayName="${fieldList[i].name}" Required="FALSE" RichText="${fieldList[i].props.richText}" RichTextMode="FullHtml" />`
              );
          } else if (fieldList[i].props.FieldTypeKind === 4) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addDateTime(fieldList[i].name, {
                DisplayFormat: DateTimeFieldFormatType.DateOnly,
                DateTimeCalendarType: CalendarType.Gregorian,
                FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
              });
          } else if (fieldList[i].props.FieldTypeKind === 6) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addChoice(fieldList[i].name, {
                Choices: fieldList[i].props.choices,
                EditFormat: fieldList[i].props.editFormat
              });
          } else if (fieldList[i].props.FieldTypeKind === 8) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addBoolean(fieldList[i].name);
          } else if (fieldList[i].props.FieldTypeKind === 9) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addNumber(fieldList[i].name, {
                MinimumValue: fieldList[i].props.minValue,
                MaximumValue: fieldList[i].props.maxValue
              });
          } else if (fieldList[i].props.FieldTypeKind === 10) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addCurrency(fieldList[i].name, {
                MinimumValue: fieldList[i].props.minValue,
                MaximumValue: fieldList[i].props.maxValue,
                CurrencyLocaleId: fieldList[i].props.localID
              });
          } else if (fieldList[i].props.FieldTypeKind === 11) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addUrl(fieldList[i].name, {
                DisplayFormat: UrlFieldFormatType.Hyperlink,
              });
          } else if (fieldList[i].props.FieldTypeKind === 12) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addNumber(fieldList[i].name);
          } else if (fieldList[i].props.FieldTypeKind === 15) {
            await this._sp.web.lists
              .getById(list.data.Id)
              .fields.addMultiChoice(fieldList[i].name, {
                Choices: fieldList[i].props.choices,
                FillInChoice: false,

              });
          }
        }
        const view: IView = await this._sp.web.lists.getById(list.data.Id).defaultView;
        for (let i = 0; i < fieldList.length; i++) {
          await view.fields.add(fieldList[i].name);
        }
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(createList) - ${err}`);
    }
    return retVal;
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
