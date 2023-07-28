export const demoWebUrl: string = "https://derekcp.sharepoint.com/sites/HumanResources";

export enum Lists {
  DEMOITEMSLIST = "Vacation Requests"
}

export enum FormMode {
  NEWVIEW = "New",
  EDITVIEW = "Edit",
  DISPLAYVIEW = "Display"
}

export interface IVacationRequestItem {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  approverId: string;
  approverDisplayName: string;
  requestorId: string;
  approvalStatus: string;
}

export class VacationRequestItem implements IVacationRequestItem {
  constructor(
    public id: number = 0,
    public title: string = "",
    public startDate: string = "",
    public endDate: string = "",
    public approverId: string = "",
    public approverDisplayName: string = "",
    public requestorId: string = "",
    public approvalStatus: string = "",
  ) { }
}