import { SPFx as spSPFx, spfi, SPFI } from "@pnp/sp";
import { GraphFI, graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/sp/webs";
import "@pnp/graph/lists";
import "@pnp/graph/sites";
import "@pnp/graph/content-types";
import "@pnp/graph/cloud-communications";
import "@pnp/sp/content-types";
import "@pnp/graph/taxonomy";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/views";
import "@pnp/sp/fields";
import "@pnp/sp/batching";
import "@pnp/graph/users";
import "@pnp/graph/photos";
import { configService } from "./configService";
import { FacilitiesRequestItem, FormView, Lists, SaveType, UserField } from "../models/models";
import { HOOPresenceStatus, IHOODropDownGroup, IHOODropDownItem, IHOOListOption } from "@n8d/htwoo-react";
import { AddChoiceProps } from "@pnp/sp/fields/types";
import { IPhoto } from "@pnp/graph/photos";

export interface IFormsService {
  readonly ready: boolean;
  readonly error: string;
  RequestStatusValues: IHOODropDownItem[];
  LocationFieldValues: IHOODropDownGroup[];
  IssueTypeValues: IHOOListOption[];
  SeverityValues: IHOOListOption[];
  currentItem: FacilitiesRequestItem;
  Init: (pageContext: any, displayMode: number) => Promise<void>;
  GetFormView(displayMode: number): FormView;
  SaveItem: (item: FacilitiesRequestItem, saveType: SaveType) => Promise<boolean>;
  DeleteItem: (id: number) => Promise<void>;
}

export default class FormsService implements IFormsService {
  private LOG_SOURCE: string = '🏳️‍🌈 FormsService';

  private _sp: SPFI;
  private _graph: GraphFI;
  private _ready: boolean = false;
  private _error: string = "";
  private _currentItem: FacilitiesRequestItem = new FacilitiesRequestItem();
  private _formView: FormView = FormView.NEW;
  private _statusFieldOptions: IHOODropDownItem[] = [];
  private _locationFieldOptions: IHOODropDownGroup[] = [];
  private _issueTypeOptions: IHOOListOption[] = [];
  private _severityOptions: IHOOListOption[] = [];
  private _noProfile = require('../assets/noprofile.png');
  static SeverityValues: IHOOListOption[];

  constructor() { }

  public get ready(): boolean {
    return this._ready;
  }

  public get error(): string {
    return this._error;
  }
  
  public get currentItem(): FacilitiesRequestItem {
    return this._currentItem;
  }
  
  public get formView(): FormView {
    return this._formView;
  }
  
  public get RequestStatusValues(): IHOODropDownItem[] {
    return this._statusFieldOptions;
  }
  
  public get LocationFieldValues(): IHOODropDownGroup[] {
    return this._locationFieldOptions;
  }
  
  public get SeverityValues(): IHOOListOption[] {
    return this._severityOptions;
  }
  
  public get IssueTypeValues(): IHOOListOption[] {
    return this._issueTypeOptions;
  }

  public async Init(context: any, displayMode: number): Promise<void> {
    try {
      this._error = "";
      this._sp = spfi().using(spSPFx({ pageContext: context.pageContext }));
      this._graph = graphfi().using(graphSPFx(context));
      await configService.Init(context);
      this._statusFieldOptions = await this._getChoiceFieldValues("RequestStatus");
      this._locationFieldOptions = await this._getLocationFieldValues();
      this._issueTypeOptions = await this._getListOptions("IssueType");
      this._severityOptions = await this._getListOptions("Severity");
      this._formView = this.GetFormView(displayMode);
      
      if (context.itemId) {
      this._currentItem = await this._getCurrentItem(context.itemId);
      }
      this._ready = true;
    } catch (err) {
      console.error(this.LOG_SOURCE, "(Init)", err);
    }
  }
  
  public GetFormView(displayMode: number): FormView {
    let retVal: FormView = FormView.NEW
    try {
      switch (displayMode) {
        case 8:
          retVal = FormView.NEW;
          break
        case 6:
          retVal = FormView.EDIT;
          break
        case 4:
          retVal = FormView.VIEW;
          break
        default:
          retVal = FormView.NEW;
          break
      }
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (GetFormView) - cannot connect to new web - ${err}`
      );
    }
    return retVal
  }

private async _getCurrentItem(itemID: number): Promise<FacilitiesRequestItem> {
    let retVal: FacilitiesRequestItem = new FacilitiesRequestItem();
    try {
      let filter = "";

      if (itemID) {
        filter += `ID eq '${itemID}'`;
      }
      
      //Get the items from the list.
      const items = await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).items.select('Id', 'Title', 'IssueType', 'Location', 'EquipmentId', 'IssueSeverity', 'IssueDescription', 'ReportedBy/FirstName', 'ReportedBy/LastName', 'ReportedBy/ID', 'ReportedBy/EMail', 'ReportedDate', 'Assignee/FirstName', 'Assignee/LastName', 'Assignee/ID', 'Assignee/EMail', 'VerificationDate', 'AdditionalComments', 'EstimatedResolutionDate', 'ResolutionDescription', 'ResolutionDate', 'ResolvedBy/FirstName', 'ResolvedBy/LastName', 'ResolvedBy/ID', 'ResolvedBy/EMail', 'InspectionDate', 'RequestStatus').expand('ResolvedBy','Assignee','ReportedBy').filter(filter)();
      //Iterate through the items from the list and create object
      items.map((item) => {
        return (
          retVal = new FacilitiesRequestItem(
            item.Id,
            item.Title,
            item.IssueType,
            item.Location,
            item.EquipmentId,
            item.IssueSeverity,
            item.IssueDescription,
            (item.ReportedBy) ? { id: item.ReportedBy.ID, email: item.ReportedBy.EMail, displayName: item.ReportedBy.FirstName + " " + item.ReportedBy.LastName, loginName: item.ReportedBy.EMail, photoUrl: "", presence: HOOPresenceStatus.Invisible } : new UserField(),             
            (item.ReportedDate) ? new Date(item.ReportedDate) : new Date(),
            (item.Assignee) ? { id: item.Assignee.ID, email: item.Assignee.EMail, displayName: item.Assignee.FirstName + " " + item.Assignee.LastName, loginName: item.Assignee.EMail, photoUrl: "", presence: HOOPresenceStatus.Invisible } : new UserField(),
            (item.VerificationDate) ? new Date(item.VerificationDate) : new Date(),
            item.AdditionalComments,
            (item.EstimatedResolutionDate) ? new Date(item.EstimatedResolutionDate) : new Date(),
            item.ResolutionDescription,
            (item.ResolutionDate) ? new Date(item.ResolutionDate) : new Date(),
            (item.ResolvedBy) ? { id: item.ResolvedBy.ID, email: item.ResolvedBy.EMail, displayName: item.ResolvedBy.FirstName + " " + item.ResolvedBy.LastName, loginName: item.ResolvedBy.EMail, photoUrl: "", presence: HOOPresenceStatus.Invisible } : new UserField(),
            (item.InspectionDate) ? new Date(item.InspectionDate) : new Date(),
            item.RequestStatus
          ))
      });
      
      if (retVal.reportedBy.email.length > 0) {
        retVal.reportedBy.photoUrl = await this._getUserPhotoUrl(retVal.reportedBy.email);
        retVal.reportedBy.presence = await this._getUserPresence(retVal.reportedBy.email);
      }
      if (retVal.assignee.email.length > 0) {
        retVal.assignee.photoUrl = await this._getUserPhotoUrl(retVal.assignee.email);
        retVal.assignee.presence = await this._getUserPresence(retVal.assignee.email);
      }
      if (retVal.resolvedBy.email.length > 0) {
        retVal.resolvedBy.photoUrl = await this._getUserPhotoUrl(retVal.resolvedBy.email);
        retVal.resolvedBy.presence = await this._getUserPresence(retVal.resolvedBy.email);
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetCurrentItem) - ${err.message}`);
    }
    return retVal;
}
  
  private async _getUserPhotoUrl(email: string): Promise<string> {
    let retVal: string = this._noProfile;
    try {
      const photo: IPhoto = await this._graph.users.getById(email).photos.getBySize("48x48");
      const blob: Blob = await photo.getBlob();
      if (blob) {
        const url = window.URL || window.webkitURL;   
        retVal = url.createObjectURL(blob);
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getUserPhotoUrl) - ${err.message}`);
    }
    return retVal;
  }
  
  private async _getUserPresence(email: string): Promise<HOOPresenceStatus> {
    let retVal: HOOPresenceStatus = HOOPresenceStatus.Invisible;
    try {
      const presence: any = await this._graph.users.getById(email).presence();
      if (presence) {
        switch (presence.availability) {
          case "Available":
          case "AvailableIdle":
            retVal = HOOPresenceStatus.Online;
            break;
          case "Away":
          case "BeRightBack":
            retVal = HOOPresenceStatus.Away;
            break;
          case "Busy":
          case "BusyIdle":
          case "DoNotDisturb":
            retVal = HOOPresenceStatus.DoNotDisturb;
            break;
          case "Offline":
          case "PresenceUnknown":
            retVal = HOOPresenceStatus.Invisible
            break;
          default:
            retVal = HOOPresenceStatus.Invisible
            break;
          
        }
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getUserPresence) - ${err.message}`);
    }
    return retVal;
  }
  
  private async _getChoiceFieldValues(fieldName: string): Promise<IHOODropDownItem[]> {
    const retVal: IHOODropDownItem[] = [];
    try {
      const choiceField: AddChoiceProps = await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).fields.getByInternalNameOrTitle(fieldName)();
      choiceField.Choices.map((choice: string, index: number) => {
        retVal.push({disabled: false, key: index, text: choice});
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getChoiceFieldValues) - ${err.message}`);
    }
    return retVal;
  }
  
  private async _getLocationFieldValues(): Promise<IHOODropDownGroup[]> {
    const retVal: IHOODropDownGroup[] = [];
    try {
      const locations: any = await this._sp.web.lists.getByTitle(Lists.LOCATIONLISTTITLE).items.orderBy('RoomNumber')();
      const groups: string[] = [];
      locations.map((location: any, index: number) => {
        if(groups.indexOf(location.Building) === -1) {
          groups.push(location.Building);
        }
      });
      
      groups.map((groupName: string, index: number) => {
        const group: IHOODropDownGroup = {groupName: groupName, groupItems:[]};
        const items: IHOODropDownItem[] = [];
        locations.map((location: any, index: number) => {
          if (location.Building === groupName) {
            items.push({disabled: false, key: `${location.RoomNumber} - ${location.RoomName}`, text: `${location.RoomNumber} - ${location.RoomName}`});
          }
        });
        if (items.length > 0) {
          group.groupItems = items;
          retVal.push(group);
        }
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getChoiceFieldValues) - ${err.message}`);
    }
    return retVal;
  }
  
  private async _getListOptions(fieldName: string): Promise<IHOOListOption[]> {
    const retVal: IHOOListOption[] = [];
    try {
      const choiceField: AddChoiceProps = await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).fields.getByInternalNameOrTitle(fieldName)();
      choiceField.Choices.map((choice: string, index: number) => {
        retVal.push({key: choice, text: choice});
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getListOptions) - ${err.message}`);
    }
    return retVal;
  }
  
  public async SaveItem(item: FacilitiesRequestItem, saveType: SaveType): Promise<boolean> {
    let retVal: boolean = false;
    try {
      //For new items we want to set the title to a specific format
      let itemTitle: string = "";
      if (saveType === SaveType.NEW) {
        itemTitle = `${item.reportedBy?.displayName}-${new Date().toLocaleDateString()}`
      } else {
        itemTitle = item.title;
      }
      //We need to make sure that any of the users in the user fields are added to the hidden site list
      let reportedBy: any;
      let assignee: any;
      let resolvedBy: any;
      if (item.reportedBy.email.length > 0) {
        reportedBy = await this._sp.web.ensureUser(item.reportedBy.email);
      }
      if (item.assignee.email.length > 0) {
        assignee = await this._sp.web.ensureUser(item.assignee.email);
      }
      if (item.resolvedBy.email.length > 0) {
        resolvedBy = await this._sp.web.ensureUser(item.resolvedBy.email);
      }
      
      //Generate request payload
      const payload: Record<string, any> = {
        Title: itemTitle,
        IssueType: item.issueType,
        Location: item.location,
        EquipmentId: item.equipmentId,
        IssueSeverity: item.severity,
        IssueDescription: item.issueDescription,
        ReportedById: reportedBy?.Id,
        ReportedDate: item.reportedDate.toISOString(),
        AssigneeId: assignee?.Id,
        VerificationDate: item.verificationDate.toISOString(),
        AdditionalComments: item.additionalComments,
        EstimatedResolutionDate: item.estimatedResolutionDate.toISOString(),
        ResolutionDescription: item.resolutionDescription,
        ResolutionDate: item.resolutionDate.toISOString(),
        ResolvedById: resolvedBy?.Id,
        InspectionDate: item.inspectionDate.toISOString(),
        RequestStatus: item.requestStatus,
       }
      
      if (saveType === SaveType.NEW) {
        await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).items.add(payload);
      } else {
        await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).items.getById(item.id).update(payload);
      }
      retVal = true;
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(SaveItem) - ${err.message}`);
    }
    
    return retVal;
  }
  
  public async DeleteItem(id: number): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).items.getById(id).delete();
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(DeleteItem) - ${err.message}`);
    }
  }
}

export const formsService = new FormsService();
