import {
  BaseImageCardView,
  IImageCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AceDemoAdaptiveCardExtensionStrings';
import { IAceDemoAdaptiveCardExtensionProps, IAceDemoAdaptiveCardExtensionState, NEW_VIEW_REGISTRY_ID, QUICK_VIEW_REGISTRY_ID } from '../AceDemoAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IAceDemoAdaptiveCardExtensionProps, IAceDemoAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      },
      {
        title: strings.AddClaim,
        action: {
          type: 'QuickView',
          parameters: {
            view: NEW_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IImageCardParameters {
    const primaryText = this.properties.description.replace("_xxx_", this.state.claims.length.toString());
    return {
      primaryText: primaryText,
      imageUrl: require('../assets/formsimage.jpg')
    };
  }


}
