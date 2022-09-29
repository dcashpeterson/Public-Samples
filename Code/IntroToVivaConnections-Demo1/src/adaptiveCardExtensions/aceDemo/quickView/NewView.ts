import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Choice, Claim } from '../../models/models';
import { IAceDemoAdaptiveCardExtensionProps, IAceDemoAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../AceDemoAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { ACEDemo } from '../../services/acedemo.service';

export interface INewViewData {
  claim: Claim;
  claimTypeValues: Choice[];
  claimStatusValues: Choice[];
}

export class NewView extends BaseAdaptiveCardView<
  IAceDemoAdaptiveCardExtensionProps,
  IAceDemoAdaptiveCardExtensionState,
  INewViewData
> {
  private LOG_SOURCE: string = "🔶 ACEDemoNewView";
  public get data(): INewViewData {
    let claim: Claim = new Claim();
    claim.claimDate = new Date().toUTCString();
    let claimStatusValues: Choice[] = ACEDemo.ClaimStatusValues;
    let claimTypeValues: Choice[] = ACEDemo.ClaimTypeValues;
    return {
      claim,
      claimTypeValues,
      claimStatusValues
    };
  }

  public get template(): ISPFxAdaptiveCard {
    let template: ISPFxAdaptiveCard = require('./template/NewView.json');
    return template;
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'save') {
          let claim: Claim = new Claim();
          claim.customerName = action.data.customerName;
          claim.claimType = action.data.claimType;
          claim.claimDate = action.data.claimDate;
          claim.claimStatus = action.data.claimStatus;
          claim.claimDescription = action.data.claimDescription;
          await ACEDemo.SaveClaim(claim);
          let claims = await ACEDemo.GetClaimsByUser(this.context.pageContext.user.loginName);
          this.setState({ claims: claims });
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID);
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}