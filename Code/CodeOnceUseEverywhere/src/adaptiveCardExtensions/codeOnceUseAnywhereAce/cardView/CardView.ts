import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CodeOnceUseAnywhereAceAdaptiveCardExtensionStrings';
import { ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState, NEW_VIEW_REGISTRY_ID, QUICK_VIEW_REGISTRY_ID } from '../CodeOnceUseAnywhereAceAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.ViewItems,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      },
      {
        title: strings.AddItem,
        action: {
          type: 'QuickView',
          parameters: {
            view: NEW_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    const welcomeMessage = `${strings.WelcomeMessage + this.context.pageContext.user.displayName}`;
    const cardText = `${strings.PrimaryText.replace("_xxx_", this.state.items.length.toString())}`;

    return {
      primaryText: welcomeMessage,
      description: cardText,
      title: this.properties.title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
