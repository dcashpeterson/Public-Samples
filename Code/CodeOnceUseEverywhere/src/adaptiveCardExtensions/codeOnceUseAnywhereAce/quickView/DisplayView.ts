import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CodeOnceUseAnywhereAceAdaptiveCardExtensionStrings';
import { ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState } from '../CodeOnceUseAnywhereAceAdaptiveCardExtension';

export interface IDisplayViewData {
  subTitle: string;
  title: string;
}

export class DisplayView extends BaseAdaptiveCardView<
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps,
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionState,
  IDisplayViewData
> {
  public get data(): IDisplayViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/DisplayViewTemplate.json');
  }
}