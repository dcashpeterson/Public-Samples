import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CodeOnceUseAnywhereAceAdaptiveCardExtensionStrings';
import { ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../CodeOnceUseAnywhereAceAdaptiveCardExtension';
import { Choice, Client, Environment } from '../../../models/models';
import { find } from '@microsoft/sp-lodash-subset';
import { COService } from '../../../services/CodeOnce.Service';

export interface IEditViewData {
  item: Client;
  pipelineStatusChoices: Choice[];
  strings: ICodeOnceUseAnywhereAceAdaptiveCardExtensionStrings
}

export class EditView extends BaseAdaptiveCardView<
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps,
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionState,
  IEditViewData
> {
  private LOG_SOURCE: string = "🔶 EditView";

  public get data(): IEditViewData {
    const item: Client = find(this.state.items, { id: this.state.currentItemID });
    return {
      item: item,
      pipelineStatusChoices: COService.PipelineChoices,
      strings: strings
    };
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'update') {
          let client: Client = find(this.state.items, { id: this.state.currentItemID });
          client.companyName = action.data.companyName;
          client.contactName = action.data.contactName;
          client.contactTitle = action.data.contactTitle;
          client.contactEmail = action.data.contactEmail;
          client.contactPhone = action.data.contactPhone;
          client.projectName = action.data.projectName;
          client.projectDescription = action.data.projectDescription;
          client.salesLeadName = COService.currentUser.Title;
          client.salesLeadId = COService.currentUser.Id;
          client.pipelineStatus = action.data.pipelineStatus;
          client.lastContactDate = new Date().toLocaleDateString();
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID, true);
          await COService.UpdateItem(client);
          const clients = await COService.GetItems(Environment.ACE, COService.currentUser.Id);
          this.setState({ items: clients, currentItemID: null });
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID, true);
        } else if (id === 'cancel') {
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID, true);
          this.setState({ currentItemID: null });
        }
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(Edit View onAction) - ${err.message}`);
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/EditViewTemplate.json');
  }
}