import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CodeOnceUseAnywhereAceAdaptiveCardExtensionStrings';
import { ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps, ICodeOnceUseAnywhereAceAdaptiveCardExtensionState } from '../CodeOnceUseAnywhereAceAdaptiveCardExtension';

export interface IEditViewData {
  subTitle: string;
  title: string;
}

export class EditView extends BaseAdaptiveCardView<
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionProps,
  ICodeOnceUseAnywhereAceAdaptiveCardExtensionState,
  IEditViewData
> {
  public get data(): IEditViewData {
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/EditViewTemplate.json');
  }
}