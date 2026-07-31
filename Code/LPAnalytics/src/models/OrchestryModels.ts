export interface ICustomMetadataValues {
  orchestryFieldId: string;
  values: string;
}

interface IOrchestryFeatures {
  id: string;
  name: string;
}

export interface IOrchestryRequest {
  templateId: string;
  requestUserId: string;
  name: string;
  description: string;
  permissionType: string;
  showInDirectory: boolean;
  owners: string[];
  members: string[];
  customMetadataValues: ICustomMetadataValues[];
  features: IOrchestryFeatures[];
  siteURL: string;
  base64LogoImage: string;
}

export interface IOrchestryValidation {
  isValid: boolean;
  errors: { errorType: string; errorMessage: string; }[];
}

export interface IOrchestryTemplate {
  CaseType: string;
  Id: string;
}

export interface IOrchestryQueued {
  httpStatusCode: number;
  requests: IOrchestryRequest[];
  resultsPerPage: number;
  currentPage: number;
  totalResults: number;
}

export enum ArchiveStatus {
  "Success",
  "Fail",
  "Archived"
}

export enum OrchestryValidationEnum {
  "Error", 
  "Invalid", 
  "Exists", 
  "Valid"
}

export interface IOrchestrySiteProvisioned {
  GroupId: string
  TeamId: string
  IsTeam: boolean
  Url: string
  Type: string
  Permission: string
  Name: string
  Description: string
  TemplateId: string
  TemplateName: string
  TemplateType: string
  TemplateSharePointType: string
  RequestCustomMetadata: RequestCustomMetadaum[]
  RequestUserPrincipalName: string
  RequestUserGraphId: string
  Owners: Owner[]
  Members: Member[]
  Channels: Channel[]
  Plans: Plan[]
}

export interface RequestCustomMetadaum {
  FieldGUID: string
  FieldTitle: string
  FieldType: string
  Values: string
}

export interface Owner {
  JobTitle: string
  Department: string
  Company: string
  Office: string
  StateOrProvince: string
  CountryOrRegion: string
  GivenName: string
  Surname: string
  Locked: string
  DisplayName: string
  UserPrincipalName: string
  UserId: string
  GUID: string
  Type: string
  Visibility: string
  GraphUserObject: any
  GraphGroupObject: any
  GraphPresence: any
  Id: string
  PrincipalId: string
}

export interface Member {
  JobTitle: string
  Department: string
  Company: string
  Office: string
  StateOrProvince: string
  CountryOrRegion: string
  GivenName: string
  Surname: string
  Locked: string
  DisplayName: string
  UserPrincipalName: string
  UserId: string
  GUID: string
  Type: string
  Visibility: string
  GraphUserObject: any
  GraphGroupObject: any
  GraphPresence: any
  Id: string
  PrincipalId: string
}

export interface Channel {
  Id: string
  DisplayName: string
  Description: string
  Tabs: Tab[]
}

export interface Tab {
  Id: string
  DisplayName: string
  WebUrl: string
}

export interface Plan {
  Id: string
  Title: string
}

export interface IArchiveStatus {
  siteId: string;
  archivalStatus: "Active" | "PendingApproval" | "Extended" | "ReadyToArchive" | "Processing" | "Done" | "Failed" | "Deleted";
}