export interface IContact {
  name: string;
  title: string;
  phone: string;
}

export class Contact implements IContact {
  constructor(
    public name: string = "",
    public title: string = "",
    public phone: string = "",
  ) { }
}

export interface IClient {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export class Client implements IClient {
  constructor(
    public id: number = 0,
    public name: string = "",
    public address: string = "",
    public city: string = "",
    public state: string = "",
    public postalCode: string = "",
    public phone: string = ""
  ) { }
}

export default interface IOpportunity {
  id: number;
  client: Client;
  projectTitle: string;
  projectDescription: string;
  engagementManager: string;
  status: string;
  lastContactDate: Date;
  nextContactDate: Date;
  contact: Contact;
}

export class Opportunity implements IOpportunity {
  constructor(
    public id: number = 0,
    public client: Client = new Client(),
    public projectTitle: string = "",
    public projectDescription: string = "",
    public engagementManager: string = "",
    public status: string = "",
    public lastContactDate: Date = new Date(),
    public nextContactDate: Date = new Date(),
    public contact: Contact = new Contact()
  ) { }
}


