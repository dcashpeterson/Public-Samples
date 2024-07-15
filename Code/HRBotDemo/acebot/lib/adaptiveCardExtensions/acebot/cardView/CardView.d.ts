import { BaseComponentsCardView, ComponentsCardViewParameters, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IAcebotAdaptiveCardExtensionProps, IAcebotAdaptiveCardExtensionState } from '../AcebotAdaptiveCardExtension';
export declare class CardView extends BaseComponentsCardView<IAcebotAdaptiveCardExtensionProps, IAcebotAdaptiveCardExtensionState, ComponentsCardViewParameters> {
    get cardViewParameters(): ComponentsCardViewParameters;
    onAction(action: IActionArguments): Promise<void>;
}
//# sourceMappingURL=CardView.d.ts.map