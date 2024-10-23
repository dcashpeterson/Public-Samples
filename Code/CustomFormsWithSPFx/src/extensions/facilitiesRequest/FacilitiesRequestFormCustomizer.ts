import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';
import { ThemeProvider } from '@microsoft/sp-component-base';

import { IFacilitiesRequestProps } from './components/FacilitiesRequest';
import { ISPFxThemes, SPFxThemes, symset } from '@n8d/htwoo-react';
import symbolSetFile from '../../common/assets/icons.svg';
import {FormView } from '../../common/models/models';
import { formsService } from '../../common/services/formsService';
import { SharePointProvider } from "@microsoft/mgt-sharepoint-provider";
import { Providers, customElementHelper } from "@microsoft/mgt-element";
import { lazyLoadComponent } from "@microsoft/mgt-spfx-utils";

const MgtComponent = React.lazy(
  () =>
    import(/* webpackChunkName: 'mgt-react-component' */ "./components/FacilitiesRequest")
);

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFacilitiesRequestFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = '🏳️‍🌈 FacilitiesRequestFormCustomizer';

export default class FacilitiesRequestFormCustomizer
  extends BaseFormCustomizer<IFacilitiesRequestFormCustomizerProperties> {
  
  private _formView: FormView = FormView.NEW;
  private _spfxThemes: ISPFxThemes = new SPFxThemes();

  public async onInit(): Promise<void> {
    await symset.initSymbols();
    await symset.initSymbols(symbolSetFile);
    
    if (!Providers.globalProvider) {
    Providers.globalProvider = new SharePointProvider(this.context);
  }
  customElementHelper.withDisambiguation('spfx-forms-solution');
    
    // Consume the new ThemeProvider service
    const themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._spfxThemes.initThemeHandler(this.domElement, themeProvider);

    // If no ThemeProvider service, use undefined which will use page context
    this._spfxThemes.initThemeHandler(document.body, undefined, undefined, undefined);
    //Initialize Service
    await formsService.Init(this.context.pageContext, this.context);
    if (formsService.ready) {
      this._formView = formsService.GetFormView(this.displayMode);
    }

    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.
    console.info(LOG_SOURCE, 'Activated VacationRequestFormCustomizer with properties:');
    console.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    return Promise.resolve();
  }

  public render(): void {
    // Use this method to perform your custom rendering.
    const facilitiesRequest = lazyLoadComponent<IFacilitiesRequestProps>(MgtComponent, {
      context: this.context,
        formView: this._formView,
        currentItem: formsService.currentItem,
        onSave: this._onSave,
        onClose: this._onClose
    });

    ReactDOM.render(facilitiesRequest, this.domElement);
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

  private _onClose =  (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  }
}
