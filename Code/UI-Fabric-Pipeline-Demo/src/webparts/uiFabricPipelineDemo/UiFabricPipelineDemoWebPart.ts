import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp";
import * as strings from 'UiFabricPipelineDemoWebPartStrings';
import UiFabricPipelineDemo from './components/UiFabricPipelineDemo';
import { IUiFabricPipelineDemoProps } from './components/IUiFabricPipelineDemoProps';
import { OpportunityDataService } from './services/dataservice';
import { Opportunity } from './models/IOpportunity';

export interface IUiFabricPipelineDemoWebPartProps {
  description: string;
  opportunities: Opportunity[];
}

export default class UiFabricPipelineDemoWebPart extends BaseClientSideWebPart<IUiFabricPipelineDemoWebPartProps> {
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
    const element: React.ReactElement<IUiFabricPipelineDemoProps> = React.createElement(
      UiFabricPipelineDemo,
      {
        description: this.properties.description,
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
