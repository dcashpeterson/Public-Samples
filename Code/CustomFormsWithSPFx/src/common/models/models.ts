import { ChoiceFieldFormatType } from "@pnp/sp/fields";

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
  { internalName: "RequestStatus", displayName: "Request Status", props: { FieldTypeKind: 6, choices: ["Submitted", "Reviewed", "Assigned to Department", "Assigned", "In Progress", "Completed"], editFormat: ChoiceFieldFormatType.Dropdown } },
  { internalName: "ResponsibleDepartment", displayName: "Responsible Department", props: { FieldTypeKind: 6, choices: ["Buildings and Grounds", "Facilities", "Information Technology"], editFormat: ChoiceFieldFormatType.Dropdown } },
  { internalName: "Assignee", displayName: "Assignee", props: { FieldTypeKind: 20 } },
  { internalName: "ServiceNotes", displayName: "Service Notes", props: { FieldTypeKind: 3, richText: false } }//,
  // { internalName: "BorrowerLastName", displayName: "Borrower Last Name", props: { FieldTypeKind: 2 } },
  // { internalName: "AccountNumber", displayName: "Account Number", props: { FieldTypeKind: 2 } },
  // { internalName: "LoanAmount", displayName: "Loan Amount", props: { FieldTypeKind: 10, minValue:0, maxValue: undefined, localID:1033  } },
  // { internalName: "LoanTerms", displayName: "Loan Terms", props: { FieldTypeKind: 6, choices: ["5 Year Fixed", "5 Year Indexed", "15 Year Fixed", "15 Year Indexed", "30 Year Fixed", "30 Year Indexed"], editFormat: ChoiceFieldFormatType.Dropdown } },
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
}

export class UserField implements IUserField{
constructor(
    public id: number = 0,
    public displayName: string = "",
    public email: string = "",
    public loginName: string = ""
  ) { }
}

export interface IFacilitiesRequestItem {
  id: number;
  title: string;
  requestor: UserField;
  requestDescription: string;
  requestStatus: string;
  responsibleDepartment: string;
  assignee: UserField;
  serviceNotes: string;
}

export class FacilitiesRequestItem implements IFacilitiesRequestItem {
  constructor(
    public id: number = 0,
    public title: string = "",
    public requestor: UserField = new UserField(),
    public requestDescription: string = "",
    public requestStatus: string = "",
    public responsibleDepartment: string = "",
    public assignee: UserField = new UserField(),
    public serviceNotes: string = ""
  ) { }
}