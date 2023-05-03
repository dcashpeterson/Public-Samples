import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CodeOnceUseAnywhereAceAdaptiveCardExtensionStrings';
import { ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState } from '../CodeOnceUseAnywhereAceAdaptiveCardExtension';

export interface INewViewData {
  subTitle: string;
  title: string;
}

export class NewView extends BaseAdaptiveCardView<
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps,
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionState,
  INewViewData
> {
  public get data(): INewViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/NewViewTemplate.json');
  }
}