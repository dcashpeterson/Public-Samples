import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceDemoPropertyPane } from './AceDemoPropertyPane';
import { sp } from "@pnp/sp";
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import "@pnp/sp/webs";
import { Claim, IClaim } from '../models/models';
import { ACEDemo } from '../services/acedemo.service';
import { EditView } from './quickView/EditView';
import { NewView } from './quickView/NewView';

export interface IAceDemoAdaptiveCardExtensionProps {
  title: string;
  description: string;
  homeSite: string;
}

export interface IAceDemoAdaptiveCardExtensionState {
  homeSite: string;
  claims: Claim[];
  currentItemID: number;
}

export const CARD_VIEW_REGISTRY_ID: string = 'AceDemo_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceDemo_QUICK_VIEW';
export const EDIT_VIEW_REGISTRY_ID: string = 'AceDemo_EDIT_VIEW';
export const NEW_VIEW_REGISTRY_ID: string = 'AceDemo_NEW_VIEW';

export default class AceDemoAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceDemoAdaptiveCardExtensionProps,
  IAceDemoAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceDemoPropertyPane | undefined;
  private LOG_SOURCE: string = "🔶 ACEDemoAdaptiveCardExtension";
  private _myClaims: IClaim[] = [];

  public async onInit(): Promise<void> {
    try {
      if (this.properties.homeSite == undefined || this.properties.homeSite.length < 1) {
        this.properties.homeSite = this.context.pageContext.site.absoluteUrl;
      }

      await ACEDemo.Init(this.properties.homeSite);

      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
      this.quickViewNavigator.register(EDIT_VIEW_REGISTRY_ID, () => new EditView());
      this.quickViewNavigator.register(NEW_VIEW_REGISTRY_ID, () => new NewView());

      //Initialize PnPLogger
      Logger.subscribe(new ConsoleListener());
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({ spfxContext: this.context });

      //Get the claims for the current user;
      this._myClaims = await ACEDemo.GetClaimsByUser(this.context.pageContext.user.loginName);


      this.state = {
        homeSite: this.properties.homeSite,
        claims: this._myClaims,
        currentItemID: 0
      };


    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onInit) - ${err.message}`, LogLevel.Error);
    }
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AceDemo-property-pane'*/
      './AceDemoPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceDemoPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
