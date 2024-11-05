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
import { FacilitiesRequestItem, FormView, Lists, SaveType } from "../models/models";
import { HOOPresenceStatus, IHOODropDownItem } from "@n8d/htwoo-react";
import { AddChoiceProps } from "@pnp/sp/fields/types";

export interface IFormsService {
  readonly ready: boolean;
  readonly error: string;
  RequestStatusValues: IHOODropDownItem[];
  ResponsibleDepartmentValues: IHOODropDownItem[];
  currentItem: FacilitiesRequestItem;
  Init: (pageContext: any, aadTokenProviderFactory: any) => Promise<void>;
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
  private _responsibleDepartmentFieldOptions: IHOODropDownItem[] = [];

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
  
  public get ResponsibleDepartmentValues(): IHOODropDownItem[] {
    return this._responsibleDepartmentFieldOptions;
  }

  public async Init(context: any, displayMode: number): Promise<void> {
    try {
      this._error = "";
      this._sp = spfi().using(spSPFx({ pageContext: context.pageContext }));
      this._graph = graphfi().using(graphSPFx(context));
      await configService.Init(context);
      this._statusFieldOptions = await this._getChoiceFieldValues("RequestStatus");
      this._responsibleDepartmentFieldOptions = await this._getChoiceFieldValues("ResponsibleDepartment");
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
      const items = await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).items.select('Id', 'Title', 'Requestor/FirstName', 'Requestor/LastName', 'Requestor/ID', 'Requestor/EMail', 'RequestDescription', 'RequestStatus', 'ResponsibleDepartment', 'Assignee/FirstName', 'Assignee/LastName', 'Assignee/ID', 'Assignee/EMail', 'ServiceNotes').expand('Requestor', 'Assignee').filter(filter)();
      //Iterate through the items from the list and create object
      items.map((item) => {
        return (
          retVal = new FacilitiesRequestItem(
            item.Id,
            item.Title,
            (item.Requestor) ? { id: item.Requestor.ID, email: item.Requestor.EMail, displayName: item.Requestor.FirstName + " " + item.Requestor.LastName, loginName: item.Requestor.EMail,photoUrl: "", presence: HOOPresenceStatus.Invisible } : null, 
            item.RequestDescription,
            item.RequestStatus,
            item.ResponsibleDepartment,
            (item.Assignee) ? { id: item.Assignee.ID, email: item.Assignee.EMail, displayName: item.Assignee.FirstName + " " + item.Assignee.LastName, loginName: item.Assignee.EMail, photoUrl: "", presence:HOOPresenceStatus.Invisible } : null, 
            item.ServiceNotes
          ))
      });
      
      if (retVal.requestor) {
        retVal.requestor.photoUrl = await this._getUserPhotoUrl(retVal.requestor.email);
        retVal.requestor.presence = await this._getUserPresence(retVal.requestor.email);
      }
      if (retVal.assignee) {
        retVal.assignee.photoUrl = await this._getUserPhotoUrl(retVal.assignee.email);
        retVal.assignee.presence = await this._getUserPresence(retVal.assignee.email);
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetCurrentItem) - ${err.message}`);
    }
    return retVal;
}
  
  private async _getUserPhotoUrl(email: string): Promise<string> {
    let retVal: string = "";
    try {
      const photo: Blob = await this._graph.users.getById(email).photos.getBySize("48x48").getBlob();
      if (photo) {
        const url = window.URL || window.webkitURL;   
        retVal = url.createObjectURL(photo);
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
  
  public async SaveItem(item: FacilitiesRequestItem, saveType: SaveType): Promise<boolean> {
    let retVal: boolean = false;
    try {
      //For new items we want to set the title to a specific format
      let itemTitle: string = "";
      if (saveType === SaveType.NEW) {
        itemTitle = `${item.requestor?.displayName}-${new Date().toLocaleDateString()}`
      } else {
        itemTitle = item.title;
      }
      let requestor: any;
      let assignee: any;
      if (item.requestor) {
        requestor = await this._sp.web.ensureUser(item.requestor.email);
      }
      
      if (item.assignee) {
        assignee = await this._sp.web.ensureUser(item.assignee.email);
      }
      
      //Generate request payload
      const payload: Record<string, any> = {
        Title: itemTitle,
        RequestorId: requestor?.Id,
        RequestDescription: item.requestDescription,
        RequestStatus: item.requestStatus,
        ResponsibleDepartment: item.responsibleDepartment,
        AssigneeId: assignee?.Id,
        ServiceNotes: item.serviceNotes
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

  // public async GetEmployeePTO(forDate: DateTime): Promise<IEmployeePTO[]> {
  //   const retVal: IEmployeePTO[] = [];
  //   this._empPTO = [];
  //   try {
  //     const spEmployee = spfi([this._sp.web, EMPLOYEE_SITE]);
  //     const epto = await spEmployee.web.lists.getByTitle("PTO Requests")
  //       .items.top(5000)
  //       .filter(`(PTOEndDate ge datetime'${forDate.startOf('day').toISO()}') and (PTOStartDate le datetime'${forDate.endOf('day').toISO()}') and (PTOReqStatus eq 'Approved')`)
  //       .select("Id, EmployeeId, Employee/Title, Employee/EMail, PTOStartDate, PTOEndDate")
  //       .expand("Employee")<IEmployeePTO[]>();
  //     if (epto.length > 0) {
  //       for (let i = 0; i < epto.length; i++) {
  //         const u = this._employees.find((o) => { return o.UserId.toLowerCase() === epto[i].Employee?.EMail.toLowerCase() });
  //         retVal.push({
  //           Id: epto[i].Id,
  //           EmployeeId: u?.LookupId || 0,
  //           EmployeeEMail: epto[i].Employee?.EMail.toLowerCase(),
  //           Employee: epto[i].Employee,
  //           PTOStartDate: (epto[i].PTOStartDate) ? DateTime.fromISO(epto[i].PTOStartDate as string, { zone: this._webTimeZone }) : null,
  //           PTOEndDate: (epto[i].PTOEndDate) ? DateTime.fromISO(epto[i].PTOEndDate as string, { zone: this._webTimeZone }) : null
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     console.error(this.LOG_SOURCE, "(GetEmployeePTO)", err);
  //   }
  //   return retVal;
  // }

}

export const formsService = new FormsService();
