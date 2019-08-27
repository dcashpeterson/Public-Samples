export interface IClient {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    lastModified: Date;
  }
  export class Client implements IClient {
    constructor(
      public name: string = "",
      public address: string = "",
      public city: string = "",
      public state: string = "",
      public zip: string = "",
      public lastModified: Date = new Date()
      
    ) {}
  }

  export interface IGroup{
    id: string;
    title: string; 
  }

  export class Group implements IGroup{
    constructor(
      public id: string = "",
      public title: string = ""
    ) {}
  }

  export interface ITeam{
    id: string;
    title: string; 
  }

  export class Team implements ITeam{
    constructor(
      public id: string = "",
      public title: string = ""
    ) {}
  }