import { SPFx as spSPFx, spfi, SPFI } from "@pnp/sp";
import { GraphFI, graphfi, graphPost, GraphQueryable, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/sp/webs";
import "@pnp/graph/lists";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";
import "@pnp/sp/content-types";

import "@pnp/sp/regional-settings";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/fields";
import "@pnp/sp/batching";
import "@pnp/graph/taxonomy";
import "@pnp/sp/items";
import "@pnp/sp/views";


import { body } from "@pnp/queryable";
import { IFieldList, ListFields, Lists, LocationListFields } from "../models/models";
import { CalendarType, DateTimeFieldFormatType, DateTimeFieldFriendlyFormatType, FieldUserSelectionMode, IFieldInfo, UrlFieldFormatType } from "@pnp/sp/fields";
import { clientID, locationContentTypeDisplayName, locationContentTypeName, requestContentTypeDisplayName, requestContentTypeName, sampleLocationData} from "../models/constants";
import { IContentTypeInfo } from "@pnp/sp/content-types";
import { IListEnsureResult } from "@pnp/sp/lists/types";

export interface IConfigService {
  readonly ready: boolean;
  readonly error: string;
  Init: (pageContext: any) => Promise<void>;
}

export default class ConfigService implements IConfigService {
  private LOG_SOURCE: string = '🏳️‍🌈 ConfigService';

  private _sp: SPFI;
  private _graph: GraphFI;
  private _ready: boolean = false;
  private _context: any;
  private _tenantUrl: string = "";
  private _error: string = "";
  private _clearConfig: boolean = false;
  private _configNeeded: boolean = true;


  constructor() { }

  public get ready(): boolean {
    return this._ready;
  }
  
  public get error(): string {
    return this._error;
  }

  public async Init(context: any): Promise<void> {
    try {
      this._error = "";
      this._sp = spfi().using(spSPFx({ pageContext: context.pageContext }));
      this._graph = graphfi().using(graphSPFx(context));
      this._context = context.pageContext;
      this._tenantUrl = this._context.web.absoluteUrl.replace(this._context.web.serverRelativeUrl, "").replace("https://", "");
      this._configNeeded = await this._isConfigNeeded(Lists.DEMOLISTTITLE)
      
      if (this._configNeeded) {
        const loadData: any[] = [];
        loadData.push(this._configDemo());
        const success = await Promise.all(loadData);

        if (success.indexOf(false) > -1) {
          this._error = "There were problems loading the application. Please contact administrative support for assistance."
        } else {
          this._ready = true;
        }
      } else {
        this._ready = true;
      }
    } catch (err) {
      console.error(this.LOG_SOURCE, "(Init)", err);
    }
    return Promise.resolve();
  }
  
  private async _isConfigNeeded(listTitle:string): Promise<boolean> {
    let retVal = true;
    try {
      if (!this._clearConfig) {
        const list = await this._sp.web.lists.getByTitle(listTitle)();
        if (list) {
          retVal = false;
        }
      }
    } catch (err) {
      console.error(this.LOG_SOURCE, "(_isConfigNeeded)", err);
    }
    return retVal;
  }
  
  private async _configDemo(): Promise<boolean> {
    let retVal = false;
    try {
      if (this._clearConfig) {
        await this._deleteList(Lists.DEMOLISTTITLE);
        await this._deleteList(Lists.LOCATIONLISTTITLE);
        await this._deleteContentType(locationContentTypeName);
        await this._deleteContentType(requestContentTypeName);
        await this._deleteSiteColumns(ListFields);
        await this._deleteSiteColumns(LocationListFields);
      } else {
        await this._createSiteColumns(LocationListFields);
        await this._createContentType(locationContentTypeName, locationContentTypeDisplayName, LocationListFields);
        await this._createSiteColumns(ListFields);
        await this._createContentType(requestContentTypeName, requestContentTypeDisplayName, ListFields);
        await this._createList(Lists.LOCATIONLISTNAME, Lists.LOCATIONLISTTITLE, Lists.LOCATIONLISTDESCRIPTION, locationContentTypeDisplayName);
        await this._createList(Lists.DEMOLISTNAME, Lists.DEMOLISTTITLE, Lists.DEMOLISTDESCRIPTION, requestContentTypeDisplayName);
        await this._addLocationData();
      }
      retVal = true;
    } catch (err) {
      console.error(this.LOG_SOURCE, "(Config Demo)", err);
    }
    return retVal;
  }
  
  private async _createList(listName: string, listTitle:string, listDescription: string, contentTypeDisplayName: string): Promise<boolean> {
    let retVal = false;
    try {
      const listInfo: IListEnsureResult = await this._sp.web.lists.ensure(listName, listDescription, 100, true, { OnQuickLaunch: false });
      const list = listInfo.list;
      await list.update({ Title: listTitle });
      const siteContentTypes: IContentTypeInfo[] = await this._sp.web.contentTypes();
      
      //Check if content type exists
      for (let i = 0; i < siteContentTypes.length; i++) {
        if (siteContentTypes[i].Name === contentTypeDisplayName) {
          if (siteContentTypes[i].Id !== undefined) {
            //check and see if the content type is already added to the list
            const listCTs: IContentTypeInfo[] = await this._sp.web.lists.getByTitle(listTitle).contentTypes();
            let ctExists = false;
            for (let i = 0; i < listCTs.length; i++) {
              if (listCTs[i].Name === contentTypeDisplayName) {
                ctExists = true;
              }
            }
            
            if (!ctExists) {
              await this._sp.web.lists.getByTitle(listTitle).contentTypes.addAvailableContentType(siteContentTypes[i].Id.StringValue);
              await this._removeDefaultContentType(listTitle);
            }
          }
        }
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_configList) - ${err}`);
    }
    return retVal;
  }
  
  private async _deleteList(listName: string): Promise<boolean> {
    let retVal = false;
    try {
      await this._sp.web.lists.getByTitle(listName).delete()
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_deleteList) - ${err}`);
    }
    return retVal;
  }
  
  private async _removeDefaultContentType(listTitle: string): Promise<boolean> {
    let retVal = false;
    try {
      const contentTypes = await this._sp.web.lists.getByTitle(listTitle).contentTypes();
      for (let i = 0; i < contentTypes.length; i++) {
        if (contentTypes[i].Name === "Item") {
          await this._sp.web.lists.getByTitle(listTitle).contentTypes.getById(contentTypes[i].Id.StringValue).delete();
        }
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_removeDefaultContentType) - ${err}`);
    }
    return retVal;
  }
  
  private async _createSiteColumns(fieldList: IFieldList[]): Promise<boolean> {
    let retVal = false;
    try {
      const webInfo = await this._sp.web();
      const groupName = "_" + webInfo.Title;

      //Iterate through the list of fields and create them in the list
      for (let i = 0; i < fieldList.length; i++) {
        //Check if the field already exists
        let field: IFieldInfo | null = null;
        try {
          field = await this._sp.web.fields.getByInternalNameOrTitle(fieldList[i].internalName)() || null;
        } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_createSiteColumns) ${fieldList[i].internalName} does not exist - ${err}`);
    }
        //Field doesn't exists so create it
        if (!field) {
          //I am a Single Line of Text field
          if (fieldList[i].props.FieldTypeKind === 2) {
            await this._sp.web.fields.addText(fieldList[i].internalName, {
              Group: groupName
            });
          }
          //I am a Multi Line of Text field
          if (fieldList[i].props.FieldTypeKind === 3) {
            await this._sp.web.fields.createFieldAsXml(
              `<Field Type="Note" Name="${fieldList[i].internalName}" DisplayName="${fieldList[i].internalName}" Required="FALSE" RichText="${fieldList[i].props.richText}" RichTextMode="FullHtml" Group="${groupName}" />`
            );
          }
          //I am a Date field
          if (fieldList[i].props.FieldTypeKind === 4) {
            await this._sp.web.fields.addDateTime(fieldList[i].internalName, {
              DisplayFormat: DateTimeFieldFormatType.DateOnly,
              DateTimeCalendarType: CalendarType.Gregorian,
              FriendlyDisplayFormat: DateTimeFieldFriendlyFormatType.Disabled,
              Group: groupName
            });
          }
          //I am a Choice field
          if (fieldList[i].props.FieldTypeKind === 6) {
            await this._sp.web.fields.addChoice(fieldList[i].internalName, {
              Choices: fieldList[i].props.choices || [],
              EditFormat: fieldList[i].props.editFormat,
              Group: groupName
            });
          }
          //I am a Yes/No field
          if (fieldList[i].props.FieldTypeKind === 8) {
            await this._sp.web.fields.addBoolean(fieldList[i].internalName, { Group: groupName, Title: fieldList[i].displayName });
          }
          //I am a Number field
          if (fieldList[i].props.FieldTypeKind === 9) {
            await this._sp.web.fields.addNumber(fieldList[i].internalName, {
              MinimumValue: fieldList[i].props.minValue,
              MaximumValue: fieldList[i].props.maxValue,
              Group: groupName
            });
          }
          //I am a Currency field
          if (fieldList[i].props.FieldTypeKind === 10) {
            await this._sp.web.fields.addCurrency(fieldList[i].internalName, {
              MinimumValue: fieldList[i].props.minValue,
              MaximumValue: fieldList[i].props.maxValue,
              CurrencyLocaleId: fieldList[i].props.localID,
              Group: groupName
            });
          }
          //I am a Hyperlink field
          if (fieldList[i].props.FieldTypeKind === 11) {
            await this._sp.web.fields.addUrl(fieldList[i].internalName, {
              DisplayFormat: UrlFieldFormatType.Hyperlink,
              Group: groupName
            });
          }
          //I am a Computed field
          if (fieldList[i].props.FieldTypeKind === 12) {
            await this._sp.web.fields.addNumber(fieldList[i].internalName, { Group: groupName });
          }
          //I am a MultiChoice Field
          if (fieldList[i].props.FieldTypeKind === 15) {
            await this._sp.web.fields.addMultiChoice(fieldList[i].internalName, {
              Choices: fieldList[i].props.choices || [],
              FillInChoice: false,
              Group: groupName
            });
          }
          //I am a Person or Group field
          if (fieldList[i].props.FieldTypeKind === 20) {
            await this._sp.web.fields.addUser(fieldList[i].internalName, { SelectionMode: FieldUserSelectionMode.PeopleOnly, Group: groupName });
          }
          
          //I am an Image field
          if (fieldList[i].props.FieldTypeKind === 99) {
            await this._sp.web.fields.addImageField(fieldList[i].internalName, { Group: groupName });
          }
          
          await this._sp.web.fields.getByInternalNameOrTitle(fieldList[i].internalName).update({Title:fieldList[i].displayName});
        }
        // const view: IView = await list.defaultView;
        // await view.fields.removeAll();
        // for (let i = 0; i < fieldList.length; i++) {
        //   await view.fields.add(fieldList[i].internalName);
        // }
        
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_configSiteColumns) - ${err}`);
    }
    return retVal;
  }
  
  private async _deleteSiteColumns(fieldList: IFieldList[]): Promise<boolean> {
    let retVal = false;
    try {
      //Iterate through the list of fields and create them in the list
      for (let i = 0; i < fieldList.length; i++) {
        //Check if the field already exists
        let field: IFieldInfo | null = null;
        try {
          field = await this._sp.web.fields.getByInternalNameOrTitle(fieldList[i].internalName)() || null;
        } catch {
          console.error(`The field ${fieldList[i].internalName} does not exist so we need to create it.`);
        }
        //Field exists so we need to delete it
        if (field) {
          await this._sp.web.fields.getByInternalNameOrTitle(fieldList[i].internalName).delete();
        }
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_deleteSiteColumns) - ${err}`);
    }
    return retVal;
  }
  
  private async _createContentType(contentTypeName: string, contentTypeDisplayName: string,  fieldList: IFieldList[]): Promise<boolean> {
    let retVal = false;
    try {
      let ctExists = false;
      const site = await this._graph.sites.getByUrl(this._tenantUrl, this._context.web.serverRelativeUrl);
      const siteInfo = await site();
      const siteContentTypes = await site.contentTypes();
      //Check if content type exists
      for (let i = 0; i < siteContentTypes.length; i++) {
        if(siteContentTypes[i].name === contentTypeName) {
          ctExists = true;
        }
      }
      
      //If content type doesn't exist create it
      if (siteInfo.id && !ctExists) {
        const ct = await this._graph.sites.getById(siteInfo.id).contentTypes.add({
          name: contentTypeName,
          base: {
            name: "Item", 
            id: "0x01",
          },
          group: `_${siteInfo.name?.replace(' ','')}`
        });
        if (ct.data.id) {
          //Add the fields to the content type
          for (let i = 0; i < fieldList.length; i++) {
            //Check if the field already exists
            let field: IFieldInfo | null = null;
            try {
              field = await this._sp.web.fields.getByInternalNameOrTitle(fieldList[i].internalName)() || null;
            } catch {
              console.error(`The field ${fieldList[i].internalName} doesn't exist.`);
            }
            
            //If field exists add it to the content type using Graph
            if (field) {
              const contentType = this._graph.sites.getById(siteInfo.id).contentTypes.getById(ct.data.id);
              const graphQueryable = GraphQueryable(contentType, "columns");
              const props = { "sourceColumn@odata.bind": `https://graph.microsoft.com/v1.0/sites/root/columns/${field.Id}` }
              await graphPost(graphQueryable, body(props));
            }
          }
          await this._sp.web.contentTypes.getById(ct.data.id).update({ Name: contentTypeDisplayName, EditFormClientSideComponentId: clientID, NewFormClientSideComponentId: clientID, DisplayFormClientSideComponentId: clientID });
          retVal = true;
        }
      } else {
        throw new Error("Site ID is undefined");
      }
    } catch (err) {
      console.error(this.LOG_SOURCE, "(_createContentType)", err);
    }
    return retVal;
  }
  
  private async _addLocationData(): Promise<boolean> {
    let retVal = false;
    try {
      const list = await this._sp.web.lists.getByTitle(Lists.LOCATIONLISTTITLE);
      await sampleLocationData.map(async (location) => {
        await list.items.add({Title: location.roomNumber, Building: location.building, RoomNumber: location.roomNumber, RoomName: location.roomName});
      });
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_addLocationData) - ${err}`);
    }
    return retVal;
  }
  
  private async _deleteContentType(contentTypeDisplayName:string): Promise<boolean> {
    let retVal = false;
    try {
      const site = await this._graph.sites.getByUrl(this._tenantUrl, this._context.web.serverRelativeUrl);
      const siteContentTypes = await site.contentTypes();
      //Check if content type exists
      for (let i = 0; i < siteContentTypes.length; i++) {
        if (siteContentTypes[i].name === contentTypeDisplayName) {
          if (siteContentTypes[i].id !== undefined) {
            await site.contentTypes.getById(siteContentTypes[i].id || "").delete();
          }
        }
      }
      retVal = true;
    } catch (err) {
      console.error(this.LOG_SOURCE, "(_deleteContentType)", err);
    }
    
    return retVal;
  }
}

export const configService = new ConfigService();