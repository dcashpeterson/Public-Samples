import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp/presets/all";

import * as strings from 'UiFabricPipelineThemesDemoWebPartStrings';
import UiFabricPipelineThemesDemo from './components/UiFabricPipelineThemesDemo';
import { IUiFabricPipelineThemesDemoProps } from './components/IUiFabricPipelineThemesDemoProps';
import { Opportunity } from './models/IOpportunity';
import { OpportunityDataService } from './services/dataservice';

export interface IUiFabricPipelineThemesDemoWebPartProps {
  opportunities: Opportunity[];
}

export default class UiFabricPipelineThemesDemoWebPart extends BaseClientSideWebPart<IUiFabricPipelineThemesDemoWebPartProps> {
  private _dataService: OpportunityDataService = new OpportunityDataService(this.context);
  private _Opportunities: Opportunity[] = [];

  public async onInit(): Promise<void> {

    //Initialize PnPJs
    sp.setup({
      spfxContext: this.context
    });
    this._Opportunities = await this._dataService.getOpportunities(sp.web);

  }

  public render(): void {
    const element: React.ReactElement<IUiFabricPipelineThemesDemoProps> = React.createElement(
      UiFabricPipelineThemesDemo,
      {
        opportunities: this._Opportunities
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [

              ]
            }
          ]
        }
      ]
    };
  }
}
