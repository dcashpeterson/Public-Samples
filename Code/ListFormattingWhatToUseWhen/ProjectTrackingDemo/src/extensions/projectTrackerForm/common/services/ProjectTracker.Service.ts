import { PageContext } from "@microsoft/sp-page-context";
import { FormMode, Lists, ProjectTrackerItem, demoWebUrl } from "../models/models";
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { GraphFI, graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/views";
import "@pnp/sp/site-users/web";
import "@pnp/graph/groups";
import "@pnp/graph/members";
import '@pnp/graph/users';
import { IWebEnsureUserResult } from "@pnp/sp/site-users/";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { IHOODropDownGroup } from "@n8d/htwoo-react";

export interface IProjectTrackerService {
  readonly ready: boolean;
  readonly sp: SPFI;
  readonly pageContext: PageContext;
  readonly formContext: FormCustomizerContext;
  webUrl: string;
  CategoryDDLValues: IHOODropDownGroup[];
  PriorityDDLValues: IHOODropDownGroup[];
  ProgressDDLValues: IHOODropDownGroup[];
  Init(serviceScope: ServiceScope, aadToken: any): Promise<void>;
  GetFormMode(displayMode: number): FormMode;
  GetCurrentItem(itemID: number): Promise<ProjectTrackerItem>;
  SaveItem: (item: ProjectTrackerItem) => Promise<void>;
  UpdateItem: (item: ProjectTrackerItem) => Promise<void>;
  DeleteItem: (id: number) => Promise<void>;
  EnsureUser: (login: string) => Promise<IWebEnsureUserResult>;
}

export class ProjectTrackerService implements IProjectTrackerService {
  private LOG_SOURCE = "🔶 ProjectTrackerService";
  public static readonly serviceKey: ServiceKey<ProjectTrackerService> =
    ServiceKey.create<ProjectTrackerService>(
      "ProjectTrackerService:IProjectTrackerService",
      ProjectTrackerService
    );
  private _sp: SPFI;
  private _graph: GraphFI;
  private _pageContext: PageContext;
  private _formContext: FormCustomizerContext;
  private _ready = false;
  private _webUrl = demoWebUrl;
  private _categoryDDLValues: IHOODropDownGroup[] = [];
  private _priorityDDLValues: IHOODropDownGroup[] = [];
  private _progressDDLValues: IHOODropDownGroup[] = [];

  public async Init(serviceScope: ServiceScope, context: FormCustomizerContext): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi(this._webUrl).using(spSPFx({ pageContext: this._pageContext }));
        this._graph = graphfi().using(graphSPFx(context));
        this._formContext = context;
        this._ready = true;
      });
      
      this._categoryDDLValues = await this._getChoiceFieldValues("Task Category");
      this._priorityDDLValues = await this._getChoiceFieldValues("Task Priority");
      this._progressDDLValues = await this._getChoiceFieldValues("Progress");
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

  public get formContext(): FormCustomizerContext {
    return this._formContext;
  }

  public get webUrl(): string {
    return this._webUrl;
  }
  public set webUrl(value: string) {
    //this._webUrl = value;
    try {
      this._sp = spfi(this._webUrl).using(spSPFx({ pageContext: this._pageContext }));
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (webUrl) - cannot connect to new web - ${err}`
      );
    }
  }
  public get CategoryDDLValues(): IHOODropDownGroup[] {
    return this._categoryDDLValues;
  }
  public get PriorityDDLValues(): IHOODropDownGroup[] {
    return this._priorityDDLValues;
  }
  public get ProgressDDLValues(): IHOODropDownGroup[] {
    return this._progressDDLValues;
  }

  public GetFormMode(displayMode: number): FormMode {
    let retVal: FormMode = FormMode.NEWVIEW
    try {
      switch (displayMode) {
        case 8:
          retVal = FormMode.NEWVIEW;
          break
        case 6:
          retVal = FormMode.EDITVIEW;
          break
        case 4:
          retVal = FormMode.DISPLAYVIEW;
          break
        default:
          retVal = null;
          break
      }
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (GetFormMode) - cannot connect to new web - ${err}`
      );
    }
    return retVal
  }

  public async GetCurrentItem(itemID: number): Promise<ProjectTrackerItem> {
    let retVal: ProjectTrackerItem = new ProjectTrackerItem();
    try {
      let filter = "";

      if (itemID) {
        filter += `ID eq '${itemID}'`;
      }

      //Get the items from the list.
      //const url = this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('TaskDueDate', false).expand('AssignedTo').filter(filter).top(1).toUrl();
      //console.error(`${this.LOG_SOURCE}:(GetCurrentItem) - ${url}`);
      const item = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('TaskDueDate', false).select('Id', 'Title', 'AssignedTo/FirstName', 'AssignedTo/LastName', 'AssignedTo/ID', 'AssignedTo/EMail', 'TaskDueDate', 'Progress', 'StartDate', 'TaskCategory', 'TaskNotes', 'TaskPriority', 'TrackerDescription','RemediationPlan').expand('AssignedTo').filter(filter).top(1)();
      //Iterate through the items from the list and create Client objects
      item.map((item) => {
        const dueDate = new Date(item.TaskDueDate);
        const startDate = new Date(item.StartDate);
        return (
          retVal = new ProjectTrackerItem(
            item.Id,
            item.Title,
            {
              id: item.AssignedTo.ID,
              displayName: item.AssignedTo.FirstName + " " + item.AssignedTo.LastName,
              email: item.AssignedTo.EMail,
              loginName: item.AssignedTo.EMail
            },
            item.TrackerDescription,
            item.TaskCategory,
            `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1 <= 9) ? "0" : ""}${(dueDate.getMonth() + 1).toString()}-${(dueDate.getDate() <= 9) ? "0" : ""}${(dueDate.getDate()).toString()}`,
            item.TaskNotes,
            item.TaskPriority,
            item.Progress,
            `${startDate.getFullYear()}-${(startDate.getMonth() + 1 <= 9) ? "0" : ""}${(startDate.getMonth() + 1).toString()}-${(startDate.getDate() <= 9) ? "0" : ""}${(startDate.getDate()).toString()}`,
            item.RemediationPlan,
          ))
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetCurrentItem) - ${err.message}`);
    }
    return retVal;
  }

  public async UpdateItem(item: ProjectTrackerItem): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).update({
        Title: item.title,
        AssignedToId: item.assignee.id,
        TrackerDescription: item.description,
        TaskCategory: item.category,
        TaskDueDate: new Date(item.dueDate).toISOString(),
        TaskNotes: item.notes,
        TaskPriority: item.priority,
        Progress: item.progress,
        StartDate: new Date(item.startDate).toISOString(),
        RemediationPlan: item.remediationPlan
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(UpdateItem) - ${err.message}`);
    }
  }

  public async SaveItem(item: ProjectTrackerItem): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.add({
        Title: item.title,
        AssignedToId: item.assignee.id,
        TrackerDescription: item.description,
        TaskCategory: item.category,
        TaskDueDate: new Date(item.dueDate).toISOString(),
        TaskNotes: item.notes,
        TaskPriority: item.priority,
        Progress: item.progress,
        StartDate: new Date(item.startDate).toISOString(),
        RemediationPlan: item.remediationPlan
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
  
  //This sets up the choice fields.
  private async _getChoiceFieldValues(fieldName: string): Promise<IHOODropDownGroup[]> {
    const retval: IHOODropDownGroup[] = [];
    try {
      const choiceField: any = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).fields.getByInternalNameOrTitle(fieldName)();
      const dropDownGroup: IHOODropDownGroup = { groupName: fieldName, groupItems: [] };
      choiceField.Choices.map((choice: string) => {
        dropDownGroup.groupItems.push({ key: choice, text: choice, disabled: false });
      });
      retval.push(dropDownGroup);
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetChoiceFieldValues) - ${err.message}`);
    }
    return retval;
  }
  
  public async EnsureUser(login: string): Promise<IWebEnsureUserResult>{
    let retVal: IWebEnsureUserResult = null;
    try {
      retVal = await this._sp.web.ensureUser(login);  
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(EnsureUser) - ${err.message}`);
    }
    return retVal;
  }
}
export const PTService = new ProjectTrackerService();
