import { PageContext } from "@microsoft/sp-page-context";
import { FormMode, Lists, VacationRequestItem, demoWebUrl } from "../models/models";
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
import '@pnp/graph/users';
import { ISiteUser } from "@pnp/sp/site-users/types";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";

export interface IVacationRequestService {
  readonly ready: boolean;
  readonly sp: SPFI;
  readonly pageContext: PageContext;
  readonly formContext: FormCustomizerContext;
  webUrl: string;
  Init(serviceScope: ServiceScope, aadToken: any): Promise<void>;
  GetFormMode(displayMode: number): FormMode;
  GetCurrentItem(itemID: number): Promise<VacationRequestItem>;
  GetRequests: (userId: string, status?: string) => Promise<VacationRequestItem[]>;
  SaveItem: (item: VacationRequestItem) => Promise<void>;
  UpdateItem: (item: VacationRequestItem) => Promise<void>;
  DeleteItem: (id: number) => Promise<void>;
  GetCurrentUser: () => Promise<ISiteUser>;

}

export class VacationRequestService implements IVacationRequestService {
  private LOG_SOURCE = "🔶 VacationRequestService";
  public static readonly serviceKey: ServiceKey<VacationRequestService> =
    ServiceKey.create<VacationRequestService>(
      "VacationRequestService:IVacationRequestService",
      VacationRequestService
    );
  private _sp: SPFI;
  private _graph: GraphFI;
  private _pageContext: PageContext;
  private _formContext: FormCustomizerContext;
  private _ready = false;
  private _webUrl = demoWebUrl;
  private _currentUser: ISiteUser;

  public async Init(serviceScope: ServiceScope, context: FormCustomizerContext): Promise<void> {
    try {
      serviceScope.whenFinished(async () => {
        this._pageContext = serviceScope.consume(PageContext.serviceKey);
        this._sp = spfi(this._webUrl).using(spSPFx({ pageContext: this._pageContext }));
        this._graph = graphfi().using(graphSPFx(context));
        this._currentUser = await this.GetCurrentUser();
      });
      this._ready = true;
      //this._currentUser = await this._getCurrentUser();
      this._formContext = context;
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

  public get currentUser(): any {
    return this._currentUser;
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

  public async GetCurrentItem(itemID: number): Promise<VacationRequestItem> {
    let retVal: VacationRequestItem = new VacationRequestItem();
    try {
      let filter = "";

      if (itemID) {
        filter += `ID eq '${itemID}'`;
      }

      //Get the items from the list.
      const items = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('RequestStartDate', false).select('Id', 'Title', 'Requestor/FirstName', 'Requestor/LastName', 'Requestor/ID', 'RequestStartDate', 'RequestEndDate', 'ApprovalStatus', 'Approver/FirstName', 'Approver/LastName', 'Approver/ID').expand('Requestor', 'Approver').filter(filter)();
      //Iterate through the items from the list and create Client objects
      items.map((item) => {
        const startDate = new Date(item.RequestStartDate);
        const endDate = new Date(item.RequestEndDate);
        return (
          retVal = new VacationRequestItem(
            item.Id,
            item.Title,
            `${startDate.getFullYear()}-${(startDate.getMonth() + 1 <= 9) ? "0" : ""}${(startDate.getMonth() + 1).toString()}-${(startDate.getDate() <= 9) ? "0" : ""}${(startDate.getDate()).toString()}`,
            `${endDate.getFullYear()}-${(endDate.getMonth() + 1 <= 9) ? "0" : ""}${(endDate.getMonth() + 1).toString()}-${(endDate.getDate() <= 9) ? "0" : ""}${(endDate.getDate()).toString()}`,
            item.Approver.ID,
            item.Approver.FirstName + " " + item.Approver.LastName,
            item.Requestor.ID,
            item.ApprovalStatus
          ))
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetRequests) - ${err.message}`);
    }
    return retVal;
  }

  public async GetRequests(userId?: string, approvalStatus?: string): Promise<VacationRequestItem[]> {
    const retVal: VacationRequestItem[] = [];
    try {
      let filter = "";

      if (userId) {
        filter += `${(filter !== "") ? " " : ""}Requestor/EMail eq '${this.pageContext.user.email}'`;
      }

      if (approvalStatus) {
        filter += `${(filter !== "") ? " and " : ""}ApprovalStatus eq '${approvalStatus}'`;
      }

      //Get the items from the list.
      const items = await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.orderBy('RequestStartDate', false).select('Id', 'Title', 'Requestor/FirstName', 'Requestor/LastName', 'Requestor/ID', 'RequestStartDate', 'RequestEndDate', 'ApprovalStatus', 'Approver/FirstName', 'Approver/LastName', 'Approver/ID').expand('Requestor', 'Approver').filter(filter)();
      //Iterate through the items from the list and create Client objects
      items.map((item) => {
        const startDate = new Date(item.RequestStartDate);
        const endDate = new Date(item.RequestEndDate);
        return (
          retVal.push(new VacationRequestItem(
            item.Id,
            item.Title,
            `${startDate.getFullYear()}-${(startDate.getMonth() + 1 <= 9) ? "0" : ""}${(startDate.getMonth() + 1).toString()}-${(startDate.getDate() <= 9) ? "0" : ""}${(startDate.getDate()).toString()}`,
            `${endDate.getFullYear()}-${(endDate.getMonth() + 1 <= 9) ? "0" : ""}${(endDate.getMonth() + 1).toString()}-${(endDate.getDate() <= 9) ? "0" : ""}${(endDate.getDate()).toString()}`,
            item.Approver.ID,
            item.Approver.FirstName + " " + item.Approver.LastName,
            item.Requestor.ID,
            item.ApprovalStatus
          ))
        );

      });

    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(GetRequests) - ${err.message}`);
    }
    return retVal;
  }

  public async UpdateItem(item: VacationRequestItem): Promise<void> {
    try {
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.getById(item.id).update({
        ApprovalStatus: item.approvalStatus,
        ApproverId: item.approverId,
        RequestStartDate: new Date(item.startDate).toISOString(),
        RequestEndDate: new Date(item.endDate).toISOString(),
        RequestorId: item.requestorId,
        Title: `${this.pageContext.user.displayName}-${item.startDate}-${item.endDate}`
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(UpdateItem) - ${err.message}`);
    }
  }

  public async SaveItem(item: VacationRequestItem): Promise<void> {
    try {
      const currentUser: any = await this.GetCurrentUser();
      const managerId: number = await this._getManagerID();
      await this._sp.web.lists.getByTitle(Lists.DEMOITEMSLIST).items.add({
        ApprovalStatus: "New",
        ApproverId: managerId,
        RequestStartDate: new Date(item.startDate).toISOString(),
        RequestEndDate: new Date(item.endDate).toISOString(),
        RequestorId: currentUser.Id,
        Title: `${this.pageContext.user.displayName}-${item.startDate}-${item.endDate}`
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

  public async GetCurrentUser(): Promise<ISiteUser> {
    let retVal: ISiteUser;
    try {
      retVal = await this._sp.web.currentUser();
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(DeleteItem) - ${err.message}`);
    }
    return retVal;
  }

  private async _getManagerID(): Promise<number> {
    let retVal: number;
    try {
      const graphUser = await this._graph.me.manager();
      const manager = await this._sp.web.ensureUser(graphUser.mail);
      retVal = manager.data.Id;
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_getManager) - ${err}`);
    }
    return retVal;

  }
}
export const VRService = new VacationRequestService();
