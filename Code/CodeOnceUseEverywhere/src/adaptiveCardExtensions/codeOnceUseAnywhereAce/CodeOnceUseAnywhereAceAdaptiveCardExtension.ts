import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { CodeOnceUseAnywhereAcePropertyPane } from './CodeOnceUseAnywhereAcePropertyPane';
import { COService } from '../../services/CodeOnce.Service';
import { Client, Environment } from '../../models/models';
import { DisplayView } from './quickView/DisplayView';
import { EditView } from './quickView/EditView';
import { NewView } from './quickView/NewView';
import { demoWebUrl } from '../../models/const';

export interface ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps {
  title: string;
  description: string;
}

export interface ICodeOnceUseAnywhereAceAdaptiveCardExtensionState {
  items: Client[];
  currentItemID: number;
  description: string;
}

export const CARD_VIEW_REGISTRY_ID: string = 'CodeOnceUseAnywhereAce_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'CodeOnceUseAnywhereAce_QUICK_VIEW';
export const DISPLAY_VIEW_REGISTRY_ID = 'CodeOnceUseAnywhereAce_DISPLAY_VIEW';
export const EDIT_VIEW_REGISTRY_ID = 'CodeOnceUseAnywhereAce_EDIT_VIEW';
export const NEW_VIEW_REGISTRY_ID = 'CodeOnceUseAnywhereAce_NEW_VIEW';

export default class CodeOnceUseAnywhereAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps,
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: CodeOnceUseAnywhereAcePropertyPane | undefined;
  private LOG_SOURCE = "🔶 CodeOnceUseAnywhereAceAdaptiveCardExtension";
  private _myItems: Client[] = [];

  public async onInit(): Promise<void> {
    try {
      await COService.Init(this.context.serviceScope, null);
      if (COService.ready) {
        COService.webUrl = demoWebUrl;
        //Get the items for the current user;
        this._myItems = await COService.GetItems(Environment.ACE, COService.currentUser.Id);
      }

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
      this.quickViewNavigator.register(DISPLAY_VIEW_REGISTRY_ID, () => new DisplayView());
      this.quickViewNavigator.register(EDIT_VIEW_REGISTRY_ID, () => new EditView());
      this.quickViewNavigator.register(NEW_VIEW_REGISTRY_ID, () => new NewView());

      //Get the items for the current user;
      this._myItems = await COService.GetItems(Environment.ACE, COService.currentUser.Id);

      this.state = {
        items: this._myItems,
        currentItemID: 1,
        description: this.properties.description
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(onInit) - ${err.message}`);
    }


    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'CodeOnceUseAnywhereAce-property-pane'*/
      './CodeOnceUseAnywhereAcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.CodeOnceUseAnywhereAcePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
