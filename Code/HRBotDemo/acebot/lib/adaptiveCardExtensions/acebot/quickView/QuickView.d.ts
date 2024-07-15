import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import { IAcebotAdaptiveCardExtensionProps, IAcebotAdaptiveCardExtensionState } from '../AcebotAdaptiveCardExtension';
export interface IQuickViewData {
    subTitle: string;
    title: string;
}
export declare class QuickView extends BaseAdaptiveCardQuickView<IAcebotAdaptiveCardExtensionProps, IAcebotAdaptiveCardExtensionState, IQuickViewData> {
    get data(): IQuickViewData;
    get template(): ISPFxAdaptiveCard;
}
//# sourceMappingURL=QuickView.d.ts.map