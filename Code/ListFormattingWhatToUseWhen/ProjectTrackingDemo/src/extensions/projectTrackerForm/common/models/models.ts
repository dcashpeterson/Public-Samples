export const demoWebUrl: string = "https://derekcp.sharepoint.com/sites/FormCustomizationProject";

export enum Lists {
  DEMOITEMSLIST = "Project tracker list SPFx"
}

export enum FormMode {
  NEWVIEW = "New",
  EDITVIEW = "Edit",
  DISPLAYVIEW = "Display"
}

export interface IAssignee{
  id: number;
  displayName: string;
  email: string;
  loginName: string;
}

export class Assignee implements IAssignee{
constructor(
    public id: number = 0,
    public displayName: string = "",
    public email: string = "",
    public loginName: string = ""
  ) { }
}

export interface IProjectTrackerItem {
  id: number;
  title: string;
  assignee: Assignee;
  description: string;
  category: string;
  dueDate: string;
  notes: string;
  priority: string;
  progress: string;
  startDate: string;
  remediationPlan: string;
}

export class ProjectTrackerItem implements IProjectTrackerItem {
  constructor(
    public id: number = 0,
    public title: string = "",
    public assignee: Assignee = new Assignee(),
    public description: string = "",
    public category: string = "",
    public dueDate: string = "",
    public notes: string = "",
    public priority: string = "",
    public progress: string = "",
    public startDate: string = "",
    public remediationPlan: string = "",
  ) { }
}