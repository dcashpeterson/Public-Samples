import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IAcebotAdaptiveCardExtensionProps {
    title: string;
}
export interface IAcebotAdaptiveCardExtensionState {
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class AcebotAdaptiveCardExtension extends BaseAdaptiveCardExtension<IAcebotAdaptiveCardExtensionProps, IAcebotAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=AcebotAdaptiveCardExtension.d.ts.map