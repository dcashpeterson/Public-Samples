import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, IMicrosoftTeams } from '@microsoft/sp-webpart-base';

import * as strings from 'IntroToTeamsDevDemo1WebPartStrings';
import IntroToTeamsDevDemo1 from './components/IntroToTeamsDevDemo1';
import { IIntroToTeamsDevDemo1Props } from './components/IIntroToTeamsDevDemo1Props';

export enum CONFIG_TYPE {
  Personal = 1,
  Team = 2,
  SharePoint = 3
}

export interface IIntroToTeamsDevDemo1WebPartProps {
  description: string;
  context: any;
  configType: CONFIG_TYPE;
}

export default class IntroToTeamsDevDemo1WebPart extends BaseClientSideWebPart<IIntroToTeamsDevDemo1WebPartProps> {
  private _context: any;
  private _configType: CONFIG_TYPE;

  public async onInit(): Promise<void> {
    try {
      if (this.context.sdks?.microsoftTeams) {
        this._context = this.context.sdks?.microsoftTeams.context;
        this._configType = (this._context?.groupId) ? CONFIG_TYPE.Team : CONFIG_TYPE.Personal;
      } else {
        this._context = this.context.pageContext;
        this._configType = CONFIG_TYPE.SharePoint;
      }
    } catch (err) {
      console.log(err);
    }
  }

  public render(): void {
    const element: React.ReactElement<IIntroToTeamsDevDemo1Props> = React.createElement(
      IntroToTeamsDevDemo1,
      {
        description: this.properties.description,
        context: this._context,
        configType: this._configType
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
