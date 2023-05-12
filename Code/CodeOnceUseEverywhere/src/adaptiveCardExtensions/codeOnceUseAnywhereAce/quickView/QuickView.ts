import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CodeOnceUseAnywhereAceAdaptiveCardExtensionStrings';
import { DISPLAY_VIEW_REGISTRY_ID, EDIT_VIEW_REGISTRY_ID, ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState } from '../CodeOnceUseAnywhereAceAdaptiveCardExtension';
import { Client, Environment } from '../../../models/models';

import { COService } from '../../../services/CodeOnce.Service';
import { find } from '@microsoft/sp-lodash-subset';

export interface IQuickViewData {
  title: string;
  items: Client[];
  editItemButton: string;
  strings: ICodeOnceUseAnywhereAceAdaptiveCardExtensionStrings;
}

export class QuickView extends BaseAdaptiveCardView<
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps,
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionState,
  IQuickViewData
> {

  private LOG_SOURCE = "🔶 QuickView";

  public get data(): IQuickViewData {
    return {
      items: this.state.items,
      title: strings.Title,
      editItemButton: strings.EditItem,
      strings: strings
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
        } else if (id === 'display') {
          this.quickViewNavigator.push(DISPLAY_VIEW_REGISTRY_ID, true);
          this.setState({ currentItemID: itemId });
        }
        else if (id === 'delete') {
          const item: Client = find(this.state.items, { id: itemId });
          await COService.DeleteItem(item.id);
          const items = await COService.GetItems(Environment.ACE, COService.currentUser.Id);
          this.setState({ items: items, currentItemID: null });
        }
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(Quick View onAction) - ${err.message}`);
    }
  }
}