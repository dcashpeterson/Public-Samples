
import { ClientsideWebpart } from "@pnp/sp/clientside-pages/index.js";

export class PlannerWebpart extends ClientsideWebpart {

  constructor(control: ClientsideWebpart) {
    super((<any>control).json);
  }

  // add property getter/setter for what we need, in this case items array within properties
  public get planId(): string {
    return this.json.webPartData?.properties?.planId || "";
  }

  public set planId(value: string) {
    this.json.webPartData.properties.planId = value;
  }

  public get groupPlans(): {id: string, title: string}[] {
    return this.json.webPartData?.properties?.groupPlans || [];
  }

  public set groupPlans(value: {id: string, title: string}[]) {
    this.json.webPartData.properties.groupPlans = value;
  }
}