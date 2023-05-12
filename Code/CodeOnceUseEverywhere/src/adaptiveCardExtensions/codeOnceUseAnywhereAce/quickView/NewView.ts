import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CodeOnceUseAnywhereAceAdaptiveCardExtensionStrings';
import { ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../CodeOnceUseAnywhereAceAdaptiveCardExtension';
import { Choice, Client, Environment } from '../../../models/models';
import { COService } from '../../../services/CodeOnce.Service';

export interface INewViewData {
  pipelineStatusChoices: Choice[];
  strings: ICodeOnceUseAnywhereAceAdaptiveCardExtensionStrings
}

export class NewView extends BaseAdaptiveCardView<
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps,
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionState,
  INewViewData
> {
  private LOG_SOURCE: string = "🔶 NewView";
  public get data(): INewViewData {
    return {
      pipelineStatusChoices: COService.PipelineChoices,
      strings: strings
    };
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'save') {
          let client: Client = new Client();
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
          await COService.SaveItem(client);
          const clients = await COService.GetItems(Environment.ACE, COService.currentUser.Id);
          this.setState({ items: clients, currentItemID: null });
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID, true);
        } else if (id === 'cancel') {
          this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID, true);
          this.setState({ currentItemID: null });
        }
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(New View onAction) - ${err.message}`);
    }
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/NewViewTemplate.json');
  }
}