import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'CodeOnceUseEverywhereDemoWebPartStrings';
import CodeOnceUseEverywhereDemo from './components/CodeOnceUseEverywhereDemo';
import { ICodeOnceUseEverywhereDemoProps } from './components/ICodeOnceUseEverywhereDemoProps';
import { COService } from '../../services/CodeOnce.Service';
import { Client, Environment } from '../../models/models';
import { symset } from '@n8d/htwoo-react/SymbolSet';
import { ThemeProvider } from '@microsoft/sp-component-base';
import { SPFxThemes, ISPFxThemes } from '@n8d/htwoo-react/SPFxThemes';
// Requires typings to be declared in an images.d.ts file
import fuireg from '@n8d/htwoo-icons/fluent-ui-regular/fluent-ui-regular.svg';

export interface ICodeOnceUseEverywhereDemoWebPartProps {
  description: string;
}

export default class CodeOnceUseEverywhereDemoWebPart extends BaseClientSideWebPart<ICodeOnceUseEverywhereDemoWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environment: Environment;
  private _clients: Client[] = [];
  private _spfxThemes: ISPFxThemes = new SPFxThemes();
  private LOG_SOURCE = "🔶 CodeOnceUseEverywhereDemoWebPart";

  public render(): void {
    const element: React.ReactElement<ICodeOnceUseEverywhereDemoProps> = React.createElement(
      CodeOnceUseEverywhereDemo,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        clients: this._clients,
        environment: this._environment
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    // Initialize Icons Symbol Set
    await symset.initSymbols(fuireg);
    // Consume the new ThemeProvider service
    const microsoftTeams = this.context.sdks?.microsoftTeams;
    const themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._spfxThemes.initThemeHandler(this.domElement, themeProvider, microsoftTeams);

    // If no ThemeProvider service, do not include property which will use page context
    this._spfxThemes.initThemeHandler(document.body);

    //Initialize Service
    await COService.Init(this.context.serviceScope);
    if (COService.ready) {
      this._environment = await this._getEnvironment();
      this._clients = await COService.GetItems(this._environment, this.context.pageContext.user.loginName);
    }


    return;
  }

  private async _getEnvironment(): Promise<Environment> {
    let retVal: Environment = Environment.SHAREPOINT;
    try {
      //If the Teams Context exists then we are in a Team, Personal App, office.com, or Outlook
      if (!!this.context.sdks.microsoftTeams) {
        const teamsContext = await this.context.sdks.microsoftTeams.teamsJs.app.getContext();

        switch (teamsContext.app.host.name) {
          case 'Office': // running in Office
            retVal = Environment.OFFICE;
            break;
          case 'Outlook': // running in Outlook
            retVal = Environment.OUTLOOK;
            break;
          case 'Teams': // running in Teams
            //We need to check if it is in a Team or a Personal App
            //We can do that by checking if there is a group attached to it.
            retVal = (teamsContext.team?.groupId) ? Environment.TEAM : Environment.PERSONALAPP;
            break;
          default:
            throw new Error('Unknown host');
        }


      } else {
        retVal = Environment.SHAREPOINT;
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE}:(_getEnvironment) - ${err.message}`);
    }
    return retVal;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
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
