import { SPFx as spSPFx, spfi, SPFI } from "@pnp/sp";
import { GraphFI, graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/sp/webs";
import "@pnp/sp/regional-settings";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";
import "@pnp/sp/views";
import "@pnp/sp/fields";
import "@pnp/sp/batching";
import "@pnp/graph/taxonomy";
import "@pnp/graph/admin";
import { configService } from "./configService";
import { FacilitiesRequestItem, FormView, Lists } from "../models/models";
import { IHOODropDownItem } from "@n8d/htwoo-react";

export interface IFormsService {
  readonly ready: boolean;
  readonly error: string;
  RequestStatusValues: IHOODropDownItem[];
  ResponsibleDepartmentValues: IHOODropDownItem[];
  currentItem: FacilitiesRequestItem;
  Init: (pageContext: any, aadTokenProviderFactory: any) => Promise<void>;
  GetFormView(displayMode: number): FormView;
}

export default class FormsService implements IFormsService {
  private LOG_SOURCE: string = '🏳️‍🌈 FormsService';

  private _sp: SPFI;
  private _graph: GraphFI;
  private _ready: boolean = false;
  private _error: string = "";
  private _currentItem: FacilitiesRequestItem;
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
  
  public get RequestStatusValues(): IHOODropDownItem[] {
    return this._statusFieldOptions;
  }
  
  public get ResponsibleDepartmentValues(): IHOODropDownItem[] {
    return this._responsibleDepartmentFieldOptions;
  }

  public async Init(pageContext: any, aadTokenProviderFactory: any): Promise<void> {
    try {
      this._error = "";
      this._sp = spfi().using(spSPFx({ pageContext }));
      this._graph = graphfi().using(graphSPFx({ aadTokenProviderFactory }));
      await configService.Init(pageContext, aadTokenProviderFactory);
      this._statusFieldOptions = await this._getChoiceFieldValues("RequestStatus");
      this._responsibleDepartmentFieldOptions = await this._getChoiceFieldValues("ResponsibleDepartment");
      
      const loadData: any[] = [];
      loadData.push(this._getCurrentItem(pageContext.itemId));
      const success = await Promise.all(loadData);

      if (success.indexOf(false) > -1) {
        this._error = "There were problems loading the application. Please contact administrative support for assistance."
      } else {
        
      }
      console.error(this.LOG_SOURCE, "(Init SP)", await this._sp.web.select("Title")());
      console.error(this.LOG_SOURCE, "(Init Graph)", await this._graph.admin.sharepoint.settings());
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
      const items = await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).items.select('Id', 'Title', 'Requestor/FirstName', 'Requestor/LastName', 'Requestor/ID','Requestor/EMail','Requestor/LoginName', 'RequestDescription', 'RequestStatus', 'ResponsibleDepartment', 'Assignee/FirstName', 'Assignee/LastName', 'Assignee/ID','Assignee/EMail','Assignee/LoginName','ServiceNotes').expand('Requestor', 'Assignee').filter(filter)();
      //Iterate through the items from the list and create object
      items.map((item) => {
        return (
          retVal = new FacilitiesRequestItem(
            item.Id,
            item.Title,
            { id: item.Requestor.ID, email: item.Requestor.EMail, displayName: item.Requestor.FirstName + " " + item.Requestor.LastName, loginName: item.Requestor.LoginName },
            item.requestDescription,
            item.requestStatus,
            item.responsibleDepartment,
            { id: item.Assignee.ID, email: item.Assignee.EMail, displayName: item.Assignee.FirstName + " " + item.Assignee.LastName, loginName: item.Assignee.LoginName },
            item.serviceNotes
          ))
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetCurrentItem) - ${err.message}`);
    }
    return retVal;
}
  
  private async _getChoiceFieldValues(fieldName: string): Promise<IHOODropDownItem[]> {
    const retVal: IHOODropDownItem[] = [];
    try {
      const choiceField: any = await this._sp.web.lists.getByTitle(Lists.DEMOLISTTITLE).fields.getByInternalNameOrTitle(fieldName)();
      choiceField.Choices.map((choice: string, index: number) => {
        retVal.push({disabled: false, key: index, text: choice});
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getChoiceFieldValues) - ${err.message}`);
    }
    return retVal;
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