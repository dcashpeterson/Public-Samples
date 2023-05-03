import { ChoiceFieldFormatType } from "@pnp/sp/fields";

export enum Lists {
  DEMOITEMSLIST = "Clients"
}
export enum Environment {
  SHAREPOINT = "SharePoint",
  TEAM = "Team",
  PERSONALAPP = "Personal App",
  OFFICE = "Office",
  OUTLOOK = "Outlook",
  LOCALHOST = "Localhost",
  ACE = "ACE"
}

export interface IClient {
  id: number;
  title: string;
  jobtitle: string;
  email: string;
  company: string;
  address: string;
  city: string;
  stateprovince: string;
  postalcode: string;
  country: string;
  salesleadname: string;
  salesleadid: number;
}

export class Client implements IClient {
  constructor(
    public id: number = 0,
    public title: string = "",
    public jobtitle: string = "",
    public email: string = "",
    public company: string = "",
    public address: string = "",
    public city: string = "",
    public stateprovince: string = "",
    public postalcode: string = "",
    public country: string = "",
    public salesleadname: string = "",
    public salesleadid: number = 0
  ) { }
}


export interface IFieldList {
  name: string;
  props: { FieldTypeKind: number; choices?: string[], richText?: boolean, editFormat?: ChoiceFieldFormatType, minValue?: number, maxValue?: number, localID?: number };
}

export const ListFields: IFieldList[] = [
  { name: "MultiLineText", props: { FieldTypeKind: 3, richText: false } },
  { name: "ChoiceFieldDDL", props: { FieldTypeKind: 6, choices: ["Choice 1", "Choice 2", "Choice 3"], editFormat: ChoiceFieldFormatType.Dropdown } },
  { name: "ChoiceFieldRadio", props: { FieldTypeKind: 6, choices: ["Radio 1", "Radio 2", "Radio 3"], editFormat: ChoiceFieldFormatType.RadioButtons } },
  { name: "ChoiceFieldCheckbox", props: { FieldTypeKind: 15, choices: ["Checkbox 1", "Checkbox 2", "Checkbox 3"], editFormat: ChoiceFieldFormatType.Dropdown } },
  { name: "CurrencyField", props: { FieldTypeKind: 10, minValue: 0, maxValue: 100000, localID: 1033 } },
  { name: "DateTimeField", props: { FieldTypeKind: 4 } },
  { name: "NumberField", props: { FieldTypeKind: 9, minValue: 0, maxValue: 100000 } },
  { name: "YesNoField", props: { FieldTypeKind: 8 } }
];