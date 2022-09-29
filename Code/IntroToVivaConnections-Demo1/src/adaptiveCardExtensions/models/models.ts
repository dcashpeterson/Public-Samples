export enum Lists {
  CLAIMSLIST = "Claims"
}

export interface IClaim {
  Id: number;
  customerName: string;
  claimDate: string;
  claimDescription: string;
  claimType: string;
  claimStatus: string;
}

export class Claim implements IClaim {
  constructor(
    public Id: number = 0,
    public customerName: string = "",
    public claimDate: string = new Date().toLocaleDateString(),
    public claimDescription: string = "",
    public claimType: string = "",
    public claimStatus: string = ""
  ) { }
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