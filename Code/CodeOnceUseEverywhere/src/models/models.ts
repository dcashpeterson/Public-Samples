import { ChoiceFieldFormatType } from "@pnp/sp/fields";

export enum Lists {
  DEMOITEMSLIST = "Pipeline"
}
export enum Environment {
  SHAREPOINT = "SharePoint",
  TEAM = "Team",
  PERSONALAPP = "Personal App",
  OFFICE = "Office",
  OUTLOOK = "Outlook",
  LOCALHOST = "Localhost",
  ACE = "Ace"
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

export interface IClient {
  id: number;
  companyName: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  projectName: string;
  projectDescription: string;
  salesLeadName: string;
  salesLeadId: number;
  pipelineStatus: string;
  lastContactDate: string;
}

export class Client implements IClient {
  constructor(
    public id: number = 0,
    public companyName: string = "",
    public contactName: string = "",
    public contactTitle: string = "",
    public contactEmail: string = "",
    public contactPhone: string = "",
    public projectName: string = "",
    public projectDescription: string = "",
    public salesLeadName: string = "",
    public salesLeadId: number = 0,
    public pipelineStatus: string = "",
    public lastContactDate: string = ""
  ) { }
}


export interface IFieldList {
  internalName: string;
  displayName: string;
  props: { FieldTypeKind: number, choices?: string[], richText?: boolean, editFormat?: ChoiceFieldFormatType, minValue?: number, maxValue?: number, localID?: number };
}

export const ListFields: IFieldList[] = [
  { internalName: "CompanyName", displayName: "Company Name", props: { FieldTypeKind: 2 } },
  { internalName: "ContactName", displayName: "Contact Name", props: { FieldTypeKind: 2 } },
  { internalName: "ContactTitle", displayName: "Contact Title", props: { FieldTypeKind: 2 } },
  { internalName: "ContactEmail", displayName: "Contact Email", props: { FieldTypeKind: 2 } },
  { internalName: "ContactPhone", displayName: "Contact Phone", props: { FieldTypeKind: 2 } },
  { internalName: "ProjectName", displayName: "Project Name", props: { FieldTypeKind: 2 } },
  { internalName: "ProjectDescription", displayName: "Project Description", props: { FieldTypeKind: 3, richText: false } },
  { internalName: "SalesLead", displayName: "Sales Lead", props: { FieldTypeKind: 20 } },
  { internalName: "PipelineStatus", displayName: "Pipeline Status", props: { FieldTypeKind: 6, choices: ["Referred", "In negotiation", "On Hold", "Closed - Won", "Closed - Lost", "Closed - Declined"], editFormat: ChoiceFieldFormatType.Dropdown } },
  { internalName: "LastContactDate", displayName: "Last Contact Date", props: { FieldTypeKind: 4 } },
];