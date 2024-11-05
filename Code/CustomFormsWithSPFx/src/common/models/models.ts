import { HOOPresenceStatus } from "@n8d/htwoo-react";
import { ChoiceFieldFormatType } from "@pnp/sp/fields";
import * as strings from "FacilitiesRequestFormCustomizerStrings";

export enum Lists {
  DEMOLISTNAME = "FacilitiesRequest",
  DEMOLISTTITLE = "Facilities Request",
  DEMOLISTDESCRIPTION = "Facilities Request List",
}

export enum FormView {
  VIEW = "View",
  EDIT = "Edit",
  NEW = "New"
}

export enum SaveType {
  NEW,
  UPDATE
}

export interface IChoice {
  choice: string;
  value: string;
}
export class Choice implements IChoice {
  constructor(
    public choice: string = "",
    public value: string = ""
  ) { }
}

export interface IFieldList {
  internalName: string;
  displayName: string;
  props: { FieldTypeKind: number, choices?: string[], richText?: boolean, editFormat?: ChoiceFieldFormatType, minValue?: number, maxValue?: number, localID?: number };
}

export const ListFields: IFieldList[] = [
  { internalName: "Requestor", displayName: "Requestor", props: { FieldTypeKind: 20 } },
  { internalName: "RequestDescription", displayName: "Request Description", props: { FieldTypeKind: 3, richText: false } },
  { internalName: "RequestStatus", displayName: "Request Status", props: { FieldTypeKind: 6, choices: strings.statusValues, editFormat: ChoiceFieldFormatType.Dropdown } },
  { internalName: "ResponsibleDepartment", displayName: "Responsible Department", props: { FieldTypeKind: 6, choices: ["Buildings and Grounds", "Facilities", "Information Technology"], editFormat: ChoiceFieldFormatType.Dropdown } },
  { internalName: "Assignee", displayName: "Assignee", props: { FieldTypeKind: 20 } },
  { internalName: "ServiceNotes", displayName: "Service Notes", props: { FieldTypeKind: 3, richText: false } }//,
  // { internalName: "ContactTitle", displayName: "Contact Title", props: { FieldTypeKind: 2 } },
  // { internalName: "ContactEmail", displayName: "Contact Email", props: { FieldTypeKind: 2 } },
  // { internalName: "ContactPhone", displayName: "Contact Phone", props: { FieldTypeKind: 2 } },
  // { internalName: "ProjectName", displayName: "Project Name", props: { FieldTypeKind: 2 } },
  // { internalName: "ProjectDescription", displayName: "Project Description", props: { FieldTypeKind: 3, richText: false } },
  // { internalName: "SalesLead", displayName: "Sales Lead", props: { FieldTypeKind: 20 } },
  // { internalName: "PipelineStatus", displayName: "Pipeline Status", props: { FieldTypeKind: 6, choices: ["Referred", "In negotiation", "On Hold", "Closed - Won", "Closed - Lost", "Closed - Declined"], editFormat: ChoiceFieldFormatType.Dropdown } },
  // { internalName: "LastContactDate", displayName: "Last Contact Date", props: { FieldTypeKind: 4 } },
];

export interface IUserField{
  id: number;
  displayName: string;
  email: string;
  loginName: string;
  photoUrl: string;
  presence: HOOPresenceStatus;
}

export class UserField implements IUserField{
constructor(
    public id: number = 0,
    public displayName: string = "",
    public email: string = "",
    public loginName: string = "",
    public photoUrl: string = "",
    public presence: HOOPresenceStatus = HOOPresenceStatus.Invisible
  ) { }
}

export interface IFacilitiesRequestItem {
  id: number;
  title: string;
  requestor: UserField|null;
  requestDescription: string;
  requestStatus: string;
  responsibleDepartment: string;
  assignee: UserField | null;
  serviceNotes: string;
}

export class FacilitiesRequestItem implements IFacilitiesRequestItem {
  constructor(
    public id: number = 0,
    public title: string = "",
    public requestor: UserField | null = null,
    public requestDescription: string = "",
    public requestStatus: string = "New Request",
    public responsibleDepartment: string = "",
    public assignee: UserField | null = null,
    public serviceNotes: string = ""
  ) { }
}