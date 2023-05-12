import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CodeOnceUseAnywhereAceAdaptiveCardExtensionStrings';
import { EDIT_VIEW_REGISTRY_ID, ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../CodeOnceUseAnywhereAceAdaptiveCardExtension';
import { Client } from '../../../models/models';
import { find } from '@microsoft/sp-lodash-subset';

export interface IDisplayViewData {
  item: Client;
  strings: ICodeOnceUseAnywhereAceAdaptiveCardExtensionStrings
}

export class DisplayView extends BaseAdaptiveCardView<
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps,
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionState,
  IDisplayViewData
> {
  private LOG_SOURCE: string = "🔶 DisplayView";

  public get data(): IDisplayViewData {
    const item: Client = find(this.state.items, { id: this.state.currentItemID });
    return {
      item: item,
      strings: strings
    };
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id, itemId } = action.data;
        if (id === 'edit') {
          this.quickViewNavigator.push(EDIT_VIEW_REGISTRY_ID, true);
          this.setState({ currentItemID: itemId });
        } else if (id === 'cancel') {
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID, true);
          this.setState({ currentItemID: 0 });
        }
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(Quick View onAction) - ${err.message}`);
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/DisplayViewTemplate.json');
  }
}