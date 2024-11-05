import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'FacilitiesRequestsWebPartStrings';
import FacilitiesRequests from './components/FacilitiesRequests';
import { IFacilitiesRequestsProps } from './components/IFacilitiesRequestsProps';
import { symset } from '@n8d/htwoo-react';
import symbolSetFile from '../../common/assets/icons.svg';
import { formsService } from '../../common/services/formsService';

export interface IFacilitiesRequestsWebPartProps {
  description: string;
}

const LOG_SOURCE: string = '🏳️‍🌈 FacilitiesRequestsWebPart';

export default class FacilitiesRequestsWebPart extends BaseClientSideWebPart<IFacilitiesRequestsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFacilitiesRequestsProps> = React.createElement(
      FacilitiesRequests,
      {
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    try {
      // Initialize Icons Symbol Set
      await symset.initSymbols(symbolSetFile);
      //Initialize Service
      await formsService.Init(this.context,0);
    } catch (error) {
      console.error(LOG_SOURCE, error);
    }
    return Promise.resolve();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

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
