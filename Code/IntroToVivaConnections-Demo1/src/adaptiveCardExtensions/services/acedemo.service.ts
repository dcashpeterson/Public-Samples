import { Logger, LogLevel } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Choice, Claim, Lists } from "../models/models";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/fields";

export interface IACEDemoService {
  Ready: boolean;
  GetClaimsByUser: (userId: string) => Promise<Claim[]>;
  ClaimStatusValues: Choice[];
  ClaimTypeValues: Choice[];
  SaveClaim: (claim: Claim) => Promise<void>;
  UpdateClaim: (claim: Claim) => Promise<void>;
  DeleteClaim: (claim: Claim) => Promise<void>;
}

export class ACEDemoService implements IACEDemoService {
  private LOG_SOURCE: string = "🔶 ACEDemoService";
  private _ready: boolean = false;
  private _currentSiteUrl: string = "";
  private _claimStatusValues: Choice[] = [];
  private _claimTypeValues: Choice[] = [];

  constructor() {
  }
  public get Ready(): boolean {
    return this._ready;
  }

  public get ClaimStatusValues(): Choice[] {
    return this._claimStatusValues;
  }
  public get ClaimTypeValues(): Choice[] {
    return this._claimTypeValues;
  }

  public async Init(currentSiteUrl: string) {
    try {
      this._ready = true;
      this._currentSiteUrl = currentSiteUrl;
      this._claimStatusValues = await this._getChoiceFieldValues("ClaimStatus");
      this._claimTypeValues = await this._getChoiceFieldValues("ClaimType");
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (init) - ${err.message}`, LogLevel.Error);
    }
  }

  public async GetClaimsByUser(userId: string): Promise<Claim[]> {
    let retVal: Claim[] = [];
    try {
      const web = Web(this._currentSiteUrl);
      retVal = await web.lists.getByTitle(Lists.CLAIMSLIST).items.orderBy("ClaimDate", false).filter(`Author/EMail eq \'${userId}\'`).get<Claim[]>();
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetClaimsByUser) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }
  public async UpdateClaim(claim: Claim): Promise<void> {
    try {
      const web = Web(this._currentSiteUrl);
      const i = await web.lists.getByTitle(Lists.CLAIMSLIST).items.getById(claim.Id).update({
        Title: claim.customerName,
        ClaimType: claim.claimType,
        ClaimDate: claim.claimDate,
        ClaimStatus: claim.claimStatus,
        ClaimDescription: claim.claimDescription
      });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (UpdateClaim) - ${err.message}`, LogLevel.Error);
    }
  }

  public async SaveClaim(claim: Claim): Promise<void> {
    try {
      const web = Web(this._currentSiteUrl);
      const i = await web.lists.getByTitle(Lists.CLAIMSLIST).items.add({
        Title: claim.customerName,
        ClaimType: claim.claimType,
        ClaimDate: claim.claimDate,
        ClaimStatus: claim.claimStatus,
        ClaimDescription: claim.claimDescription
      });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (SaveClaim) - ${err.message}`, LogLevel.Error);
    }
  }

  public async DeleteClaim(claim: Claim): Promise<void> {
    try {
      const web = Web(this._currentSiteUrl);
      const i = await web.lists.getByTitle(Lists.CLAIMSLIST).items.getById(claim.Id).delete();
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (DeleteClaim) - ${err.message}`, LogLevel.Error);
    }
  }

  private async _getChoiceFieldValues(fieldName: string): Promise<Choice[]> {
    let retVal: Choice[] = [];
    try {
      const web = Web(this._currentSiteUrl);
      const choiceField: any = await web.lists.getByTitle(Lists.CLAIMSLIST).fields.getByInternalNameOrTitle(fieldName)();
      choiceField.Choices.map((choice: string) => {
        retVal.push(new Choice(choice, choice));
      });
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (GetChoiceFieldValues) - ${err.message}`, LogLevel.Error);
    }
    return retVal;
  }

}
export const ACEDemo = new ACEDemoService();
