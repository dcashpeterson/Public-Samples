import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { Choice, Claim } from '../../models/models';
import { IAceDemoAdaptiveCardExtensionProps, IAceDemoAdaptiveCardExtensionState } from '../AceDemoAdaptiveCardExtension';
import { find } from "@microsoft/sp-lodash-subset";
import { Logger, LogLevel } from "@pnp/logging";
import { ACEDemo } from '../../services/acedemo.service';

export interface IEditViewData {
  claim: Claim;
  claimTypeValues: Choice[];
  claimStatusValues: Choice[];
}

export class EditView extends BaseAdaptiveCardView<
  IAceDemoAdaptiveCardExtensionProps,
  IAceDemoAdaptiveCardExtensionState,
  IEditViewData
> {
  private LOG_SOURCE: string = "🔶 ACEDemoEditView";
  public get data(): IEditViewData {
    let claim: Claim = find(this.state.claims, { Id: this.state.currentItemID });
    let claimStatusValues: Choice[] = ACEDemo.ClaimStatusValues;
    let claimTypeValues: Choice[] = ACEDemo.ClaimTypeValues;
    return {
      claim,
      claimTypeValues,
      claimStatusValues
    };
  }

  public get template(): ISPFxAdaptiveCard {
    let template: ISPFxAdaptiveCard = require('./template/EditView.json');
    return template;
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'update') {
          let claim: Claim = find(this.state.claims, { Id: this.state.currentItemID });
          claim.customerName = action.data.customerName;
          claim.claimType = action.data.claimType;
          claim.claimDate = action.data.claimDate;
          claim.claimStatus = action.data.claimStatus;
          claim.claimDescription = action.data.claimDescription;
          await ACEDemo.UpdateClaim(claim);
          let claims = await ACEDemo.GetClaimsByUser(this.context.pageContext.user.loginName);
          this.setState({ claims: claims });
          this.quickViewNavigator.pop();
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }
}