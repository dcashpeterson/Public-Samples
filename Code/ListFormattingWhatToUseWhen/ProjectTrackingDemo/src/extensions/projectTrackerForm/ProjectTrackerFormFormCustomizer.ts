import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ThemeProvider } from '@microsoft/sp-component-base';
import {
  BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';

import ProjectTrackerForm, { IProjectTrackerFormProps } from './components/ProjectTrackerForm';
import { symset } from '@n8d/htwoo-react/SymbolSet';
import fuireg from '@n8d/htwoo-icons/fluent-ui-regular/fluent-ui-regular.svg';
import { PTService } from './common/services/ProjectTracker.Service';
import { ISPFxThemes, SPFxThemes } from '@n8d/htwoo-react/SPFxThemes';
import { FormMode, ProjectTrackerItem, demoWebUrl } from './common/models/models';

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IProjectTrackerFormFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

//const LOG_SOURCE: string = 'ProjectTrackerFormFormCustomizer';

export default class ProjectTrackerFormFormCustomizer
  extends BaseFormCustomizer<IProjectTrackerFormFormCustomizerProperties> {
  private _formMode: FormMode = FormMode.NEWVIEW;
  private _spfxThemes: ISPFxThemes = new SPFxThemes();
  private _currentItem: ProjectTrackerItem = new ProjectTrackerItem();

  public async onInit(): Promise<void> {
   await symset.initSymbols(fuireg);

    // Consume the new ThemeProvider service
    const themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._spfxThemes.initThemeHandler(this.domElement, themeProvider);

    // If no ThemeProvider service, use undefined which will use page context
    this._spfxThemes.initThemeHandler(document.body, undefined, undefined, undefined);

    //Initialize Service
    await PTService.Init(this.context.serviceScope, this.context);
    if (PTService.ready) {
      PTService.webUrl = demoWebUrl;
      this._formMode = PTService.GetFormMode(this.displayMode);
      if (this._formMode !== FormMode.NEWVIEW) {
        this._currentItem = await PTService.GetCurrentItem(this.context.itemId);
      }
      
    }
    return Promise.resolve();
  }

  public render(): void {
    // Use this method to perform your custom rendering.

    const projectTrackerForm: React.ReactElement<{}> =
      React.createElement(ProjectTrackerForm, {
        context: this.context,
        formMode: this._formMode,
        currentItem: this._currentItem,
        onSave: this._onSave,
        onClose: this._onClose
       } as IProjectTrackerFormProps);

    ReactDOM.render(projectTrackerForm, this.domElement);
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
