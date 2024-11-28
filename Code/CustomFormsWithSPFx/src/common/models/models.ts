import { HOOPresenceStatus } from "@n8d/htwoo-react";
import { ChoiceFieldFormatType } from "@pnp/sp/fields";
import * as strings from "FacilitiesRequestFormCustomizerStrings";

export enum Lists {
  DEMOLISTNAME = "FacilitiesRequest",
  DEMOLISTTITLE = "Facilities Request",
  DEMOLISTDESCRIPTION = "Facilities Request List",
  LOCATIONLISTNAME = "Locations",
  LOCATIONLISTTITLE = "Locations",
  LOCATIONLISTDESCRIPTION = "Locations List",
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

export enum ReportStep {
  STEP1,
  STEP2,
  STEP3,
  STEP4
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

export const LocationListFields: IFieldList[] = [
  { internalName: "Building", displayName: "Building", props: { FieldTypeKind: 2 } },
  { internalName: "RoomNumber", displayName: "Room Number", props: { FieldTypeKind: 2 } },
  { internalName: "RoomName", displayName: "Room Name", props: { FieldTypeKind: 2 } }
];

export const ListFields: IFieldList[] = [
  { internalName: "IssueType", displayName: "Issue Type", props: { FieldTypeKind: 6, choices: strings.issueTypeValues, editFormat: ChoiceFieldFormatType.Dropdown } },
  { internalName: "Location", displayName: "Location", props: { FieldTypeKind: 2 } },
  { internalName: "EquipmentId", displayName: "Equipment ID", props: { FieldTypeKind: 2 } },
  { internalName: "IssueSeverity", displayName: "Severity", props: { FieldTypeKind: 6, choices: strings.severityValues, editFormat: ChoiceFieldFormatType.Dropdown } },
  { internalName: "IssueDescription", displayName: "Description of Issue", props: { FieldTypeKind: 3, richText: false } },
  { internalName: "ReportedBy", displayName: "Reported By", props: { FieldTypeKind: 20 } },
  { internalName: "ReportedDate", displayName: "Reported Date", props: { FieldTypeKind: 4 } },
  { internalName: "Assignee", displayName: "Assignee", props: { FieldTypeKind: 20 } },
  { internalName: "VerificationDate", displayName: "Verification Date", props: { FieldTypeKind: 4 } },
  { internalName: "AdditionalComments", displayName: "Additional Comments", props: { FieldTypeKind: 3, richText: false } },
  { internalName: "EstimatedResolutionDate", displayName: "Estimated Resolution Date", props: { FieldTypeKind: 4 } },
  { internalName: "ResolutionDescription", displayName: "Resolution Description", props: { FieldTypeKind: 3, richText: false } },
  { internalName: "ResolutionDate", displayName: "Resolution Date", props: { FieldTypeKind: 4 } },
  { internalName: "ResolvedBy", displayName: "Resolved by", props: { FieldTypeKind: 20 } },
  { internalName: "InspectionDate", displayName: "Inspection Date", props: { FieldTypeKind: 4 } },
  { internalName: "RequestStatus", displayName: "Request Status", props: { FieldTypeKind: 6, choices: strings.statusValues, editFormat: ChoiceFieldFormatType.Dropdown } }
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

export interface ILocation {
  id: number;
  building: string;
  roomNumber: string;
  roomName: string;  
}

export class Location implements ILocation {
  constructor(
    public id: number = 0,
    public building: string = "",
    public roomNumber: string = "",
    public roomName: string = ""
  ) {} 
}

export interface IFacilitiesRequestItem {
  id: number;
  title: string;
  issueType: string; 
  location: string; 
  equipmentId: string; 
  severity: string;
  issueDescription: string;
  reportedBy: UserField;
  reportedDate: Date;
  assignee: UserField;
  verificationDate: Date;
  additionalComments: string;
  estimatedResolutionDate: Date;
  resolutionDescription: string;
  resolutionDate: Date; 
  resolvedBy: UserField;
  inspectionDate: Date;   
  requestStatus: string;
  reportStep: ReportStep;
}

export class FacilitiesRequestItem implements IFacilitiesRequestItem {
  constructor(
    public id: number = 0,
    public title: string = "",
    public issueType: string = "",
    public location: string = "",
    public equipmentId: string = "",
    public severity: string = "",
    public issueDescription: string = "",
    public reportedBy: UserField = new UserField(),
    public reportedDate: Date = new Date(),
    public assignee: UserField = new UserField(),
    public verificationDate: Date = new Date(),
    public additionalComments: string = "",
    public estimatedResolutionDate: Date = new Date(),
    public resolutionDescription: string = "",
    public resolutionDate: Date = new Date(),
    public resolvedBy: UserField = new UserField(),
    public inspectionDate: Date = new Date(),
    public requestStatus: string = "Reported",
    public reportStep: ReportStep = ReportStep.STEP1    
  ) { }
}