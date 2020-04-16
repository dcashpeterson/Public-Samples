import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'UiFabricReactDemoWebPartStrings';
import UiFabricReactDemo from './components/UiFabricReactDemo';
import { IUiFabricReactDemoProps } from './components/IUiFabricReactDemoProps';
import { Opportunity } from './models/IOpportunity';
import { OpportunityDataService } from './services/dataservices';
import { sp } from "@pnp/sp/presets/all";

export interface IUiFabricReactDemoWebPartProps {
  opportunities: Opportunity[];
}

export default class UiFabricReactDemoWebPart extends BaseClientSideWebPart<IUiFabricReactDemoWebPartProps> {
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
    const element: React.ReactElement<IUiFabricReactDemoProps> = React.createElement(
      UiFabricReactDemo,
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
