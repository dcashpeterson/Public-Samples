import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceDemoAdaptiveCardExtensionStrings';
import { Claim, IClaim } from '../../models/models';
import { EDIT_VIEW_REGISTRY_ID, IAceDemoAdaptiveCardExtensionProps, IAceDemoAdaptiveCardExtensionState } from '../AceDemoAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";
import { find } from "@microsoft/sp-lodash-subset";
import { ACEDemo } from '../../services/acedemo.service';

export interface IQuickViewData {
  title: string;
  claims: IClaim[];
  editClaimButton: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IAceDemoAdaptiveCardExtensionProps,
  IAceDemoAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";

  public get data(): IQuickViewData {
    return {
      claims: this.state.claims,
      title: strings.Title,
      editClaimButton: strings.EditClaimButton
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, itemId } = action.data;
        if (id === 'edit') {
          this.quickViewNavigator.push(EDIT_VIEW_REGISTRY_ID, true);
          this.setState({ currentItemID: itemId });
        } else if (id === 'delete') {
          let claim: Claim = find(this.state.claims, { Id: itemId });
          await ACEDemo.DeleteClaim(claim);
          let claims = await ACEDemo.GetClaimsByUser(this.context.pageContext.user.loginName);
          this.setState({ claims: claims });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (Quick View onAction) - ${err}`, LogLevel.Error);
    }
  }
}