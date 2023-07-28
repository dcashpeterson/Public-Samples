import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';

import { ThemeProvider } from '@microsoft/sp-component-base';

import { SPFxThemes, ISPFxThemes } from '@n8d/htwoo-react/SPFxThemes';
import { symset } from '@n8d/htwoo-react/SymbolSet';
//import fuireg from '@n8d/htwoo-icons/fluent-ui-regular/fluent-ui-regular.svg';

import VacationRequest, { IVacationRequestProps } from './components/VacationRequest';
import { VRService } from './common/services/VacationRequest.Service';
import { FormMode, VacationRequestItem, demoWebUrl } from './common/models/models';

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IVacationRequestFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = '🔶 VacationRequestFormCustomizer';

export default class VacationRequestFormCustomizer
  extends BaseFormCustomizer<IVacationRequestFormCustomizerProperties> {
  private _formMode: FormMode = FormMode.NEWVIEW;
  private _requests: VacationRequestItem[] = [];
  private _spfxThemes: ISPFxThemes = new SPFxThemes();
  private _currentItem: VacationRequestItem;

  public async onInit(): Promise<void> {
    await symset.initSymbols();
    //await symset.initSymbols(fuireg);

    // Consume the new ThemeProvider service
    const themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._spfxThemes.initThemeHandler(this.domElement, themeProvider);

    // If no ThemeProvider service, use undefined which will use page context
    this._spfxThemes.initThemeHandler(document.body, undefined, undefined, undefined);

    //Initialize Service
    await VRService.Init(this.context.serviceScope, this.context);
    if (VRService.ready) {
      VRService.webUrl = demoWebUrl;
      this._formMode = VRService.GetFormMode(this.displayMode);
      this._currentItem = await VRService.GetCurrentItem(this.context.itemId);
      this._requests = await VRService.GetRequests(this.context.pageContext.user.email, this._currentItem.approvalStatus);
    }

    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.
    console.info(LOG_SOURCE, 'Activated VacationRequestFormCustomizer with properties:');
    console.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    return Promise.resolve();
  }

  public render(): void {
    // Use this method to perform your custom rendering.

    const vacationRequest: React.ReactElement<{}> =
      React.createElement(VacationRequest, {
        context: this.context,
        formMode: this._formMode,
        requests: this._requests,
        currentItem: this._currentItem,
        onSave: this._onSave,
        onClose: this._onClose
      } as IVacationRequestProps);

    ReactDOM.render(vacationRequest, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = (): void => {

    // You MUST call this.formSaved() after you save the form.
    this.formSaved();
  }

  private _onClose = (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  }
}
