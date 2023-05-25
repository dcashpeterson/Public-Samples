import { PageContext } from "@microsoft/sp-page-context";
import { IFieldList, ListFields, Lists } from "../models/models";
import { CalendarType, DateTimeFieldFormatType, DateTimeFieldFriendlyFormatType, FieldUserSelectionMode, UrlFieldFormatType } from "@pnp/sp/fields";
import { IView } from "@pnp/sp/views";
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/views";
import { demoWebUrl } from "../models/const";

export interface ICodeOnceConfigService {
  readonly ready: boolean;
  readonly sp: SPFI;
  readonly pageContext: PageContext;
  webUrl: string;
  Init(serviceScope: ServiceScope): Promise<void>;
}

export class CodeOnceConfigService implements ICodeOnceConfigService {
  private LOG_SOURCE = "🔶 CodeOnceConfigService";
  public static readonly serviceKey: ServiceKey<CodeOnceConfigService> =
    ServiceKey.create<CodeOnceConfigService>(
      "CodeOnceConfigService:ICodeOnceConfigService",
      CodeOnceConfigService
    );
  private _sp: SPFI;
  private _pageContext: PageContext;
  private _ready = false;
  private _webUrl = demoWebUrl;

  public async Init(serviceScope: ServiceScope): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi(this._webUrl).using(SPFx({ pageContext: this._pageContext }));
      });

      this._ready = await this._configList(Lists.DEMOITEMSLIST, "");
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
    //this._webUrl = value;
    console.log("hi");
    try {
      this._sp = spfi(this._webUrl).using(SPFx({ pageContext: this._pageContext }));
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (webUrl) - cannot connect to new web - ${err}`
      );
    }
  }

  // private async _configApp(): Promise<boolean> {
  //   let retVal = false;
  //   try {
  //     if (await this._configList(Lists.DEMOITEMSLIST, "")) {
  //       retVal = true;
  //     } else {
  //       retVal = await this._configSiteColumns(ListFields, Lists.DEMOITEMSLIST);
  //     }
  //   } catch (err) {
  //     console.error(`${this.LOG_SOURCE}:(ConfigApp) - ${err}`);
  //   }
  //   return retVal;
  // }

  private async _configSiteColumns(fieldList: IFieldList[], listName: string): Promise<boolean> {
    let retVal = false;
    try {
      const webInfo = await this._sp.web();
      const groupName = "_" + webInfo.Title;
      const list = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST);
      for (let i = 0; i < fieldList.length; i++) {
        if (fieldList[i].props.FieldTypeKind === 2) {

          await list.fields.addText(fieldList[i].internalName, {
            Group: groupName,
            Title: fieldList[i].displayName
          });


        } else if (fieldList[i].props.FieldTypeKind === 3) {

          await list.fields.createFieldAsXml(
            `<Field Type="Note" Name="${fieldList[i].internalName}" DisplayName="${fieldList[i].internalName}" Required="FALSE" RichText="${fieldList[i].props.richText}" RichTextMode="FullHtml" Group="${groupName}" />`
          );
          await list.fields.getByInternalNameOrTitle(fieldList[i].internalName).update({ Title: fieldList[i].displayName });

        } else if (fieldList[i].props.FieldTypeKind === 4) {

          await list.fields.addDateTime(fieldList[i].internalName, {
            DisplayFormat: DateTimeFieldFormatType.DateOnly,
            DateTimeCalendarType: CalendarType.Gregorian,
            FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
            Group: groupName,
            Title: fieldList[i].displayName
          });

        } else if (fieldList[i].props.FieldTypeKind === 6) {

          await list.fields.addChoice(fieldList[i].internalName, {
            Choices: fieldList[i].props.choices,
            EditFormat: fieldList[i].props.editFormat,
            Group: groupName,
            Title: fieldList[i].displayName
          });

        } else if (fieldList[i].props.FieldTypeKind === 8) {

          await list.fields.addBoolean(fieldList[i].internalName, { Group: groupName, Title: fieldList[i].displayName });

        } else if (fieldList[i].props.FieldTypeKind === 9) {

          await list.fields.addNumber(fieldList[i].internalName, {
            MinimumValue: fieldList[i].props.minValue,
            MaximumValue: fieldList[i].props.maxValue,
            Group: groupName,
            Title: fieldList[i].displayName
          });

        } else if (fieldList[i].props.FieldTypeKind === 10) {

          await list.fields.addCurrency(fieldList[i].internalName, {
            MinimumValue: fieldList[i].props.minValue,
            MaximumValue: fieldList[i].props.maxValue,
            CurrencyLocaleId: fieldList[i].props.localID,
            Group: groupName,
            Title: fieldList[i].displayName
          });

        } else if (fieldList[i].props.FieldTypeKind === 11) {

          await list.fields.addUrl(fieldList[i].internalName, {
            DisplayFormat: UrlFieldFormatType.Hyperlink,
            Group: groupName,
            Title: fieldList[i].displayName
          });

        } else if (fieldList[i].props.FieldTypeKind === 12) {

          await list.fields.addNumber(fieldList[i].internalName, { Group: groupName, Title: fieldList[i].displayName });

        } else if (fieldList[i].props.FieldTypeKind === 15) {

          await list.fields.addMultiChoice(fieldList[i].internalName, {
            Choices: fieldList[i].props.choices,
            FillInChoice: false,
            Group: groupName,
            Title: fieldList[i].displayName
          });

        } else if (fieldList[i].props.FieldTypeKind === 20) {

          await list.fields.addUser(fieldList[i].internalName, { SelectionMode: FieldUserSelectionMode.PeopleOnly, Group: groupName, Title: fieldList[i].displayName });

        }
      }

      const view: IView = await list.defaultView;
      await view.fields.removeAll();
      for (let i = 0; i < fieldList.length; i++) {
        await view.fields.add(fieldList[i].internalName);
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_configSiteColumns) - ${err}`);
    }
    return retVal;
  }

  private async _configList(
    listName: string,
    listDescription: string): Promise<boolean> {
    let retVal = false;
    try {
      const list = await this._sp.web.lists.ensure(listName, listDescription, 100, false, { OnQuickLaunch: true });
      if (list.created) {
        await this._sp.web.lists.getByTitle(listName).fields.getByTitle("Title").update({ Hidden: true });
        await this._configSiteColumns(ListFields, Lists.DEMOITEMSLIST);
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_configList) - ${err}`);
    }
    return retVal;
  }
}
export const COConfigService = new CodeOnceConfigService();
