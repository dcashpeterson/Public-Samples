import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';

import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp, SearchQuery, SearchResults, Web, List, Item } from '@pnp/sp';
import "@pnp/polyfill-ie11";

import * as strings from 'ProjMgtAdminWebPartStrings';
import ProjMgtAdmin from './components/ProjMgtAdmin';
import { IProjMgtAdminProps } from './components/IProjMgtAdminProps';
import { IClient, Client } from './models/Models';
import * as microsoftTeams from '@microsoft/teams-js';

export interface IProjMgtAdminWebPartProps {
  adminSiteCollection: string;
  adminListName: string;
  clients: Client[];
}

export default class ProjMgtAdminWebPart extends BaseClientSideWebPart<IProjMgtAdminWebPartProps> {
  //Set up all the private variables we are going to use in thet web part
  private LOG_SOURCE: string = "Project Management Admin WebPart";
  private _siteCollections: IPropertyPaneDropdownOption[] = [];
  private _lists: IPropertyPaneDropdownOption[] = [];
  private _clients: Client[] = [];
  private _teamsContext: microsoftTeams.Context;
  private _spContext: WebPartContext;

  //Set up the property pane
  protected onPropertyPaneConfigurationStart(): void {
    this.getPropertyPaneConfiguration();
    this.context.propertyPane.refresh();
  }
  
  //Set up the propertyt pane fields
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
                PropertyPaneDropdown('adminSiteCollection', {
                  label: "Select An Administration Site Collection",
                  options: this._siteCollections,
                }),
                PropertyPaneDropdown('adminListName', {
                  label: "Select the Admin List Name",
                  options: this._lists,
                })
              ]
            }
          ]
        }
      ]
    };
  }

  //What do we do when an item in the property pane changes
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    //Make this responsive when the site collection drop down changes.
    //We want to refresh the list of lists only when the admin site collection changes
    if (propertyPath === 'adminSiteCollection' && newValue) {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      this._getListsFromSiteCollection(newValue);
      this.context.propertyPane.refresh();
    }
    else {
      //If it isn't site site collection drop down then just call the main function
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }
  }
  
  //Inititalization function.
  //Set up the webpart when it loads.
  public async onInit(): Promise<void> {
    try{
      // subscribe a listener for error handling
      Logger.subscribe(new ConsoleListener());

      // set the active log level
      Logger.activeLogLevel = LogLevel.Info;

      //Initialize PnPJs
      sp.setup({
        spfxContext: this.context
      });

      //Set up the different context objects
      //SharePoint and Teams are different
      this._spContext = this.context;
      this._teamsContext = await this._getTeamsContext();
      
      //Set up the configuration panel
      //Gett site collections

      this._getSiteCollections();
      
      //If thte property is alreayd set get the lists in that Site Collection
      if (this.properties.adminSiteCollection){
        await this._getListsFromSiteCollection(this.properties.adminSiteCollection);
        await this._getClients(this.properties.adminSiteCollection, this.properties.adminListName);
      }
      

    } catch (err) {
      Logger.write(`${err} - ${this.LOG_SOURCE} (render) -- Could not start web part.`, LogLevel.Error);
    }
  }

  //Check to see if the teams context if valid.
  //If you are in SharePoint this returns null
  private async _getTeamsContext(): Promise<any>{
    
    let retVal: Promise<any> = Promise.resolve();
    if (this.context.microsoftTeams) {
      retVal = new Promise((resolve, reject) => {
        this.context.microsoftTeams.getContext(context => {
          this._teamsContext = context;
          resolve();
        });
      });
    }
    //return retVal;

  }

  //Get all the site collecions for the tenant
  //This will only return the ones the user has access to
  private async _getSiteCollections(): Promise<void> {
    let siteCollections: IPropertyPaneDropdownOption[] = [];
    
    //Get all the site collections in the tenant
    let results = await sp.search(<SearchQuery>{
      Querytext: "contentclass:STS_Site",
      SelectProperties: ["Title", "SPSiteUrl", "WebTemplate"],
      RowLimit: 500,
      TrimDuplicates: false          
    });
    if (results.RowCount > 0){
      results.PrimarySearchResults.map((value:any) => {
        siteCollections.push({
          key: value.SPSiteUrl,
          text: value.Title
        });
      });
    }

    this._siteCollections = siteCollections;

  }
  
  //Get the list of Lists in the site collection.
  private async _getListsFromSiteCollection(siteUrl: string): Promise<void> {
    let listOptions: IPropertyPaneDropdownOption[] = [];

    let web = new Web(siteUrl);

    let lists:List[] = await web.lists.get();

    lists.map((l:any) =>{
      if (!l.Hidden){
        listOptions.push({
          key:l.Title,
          text: l.Title
        });
      }
    });
    
    this._lists = listOptions;

  }

  //Get list of clients from thte list
  private async _getClients(siteUrl: string,listName: string): Promise<void> {
    let clients: IClient[] = [];

    let web = new Web(siteUrl);

    //Use PnPJs to get the list of clients.
    let items:any = await web.lists.getByTitle(listName).items.get();

    //Create an array of Client Objects
    items.map((i:any) =>{
      let client = new Client();
      client.name = i.Title;
      client.address = i.WorkAddress;
      client.city = i.WorkCity;
      client.state = i.WorkState;
      client.zip = i.WorkZip;
      client.lastModified = new Date(i.Modified);
      clients.push(client);
    });
    
    //Generate the list of clients
    this._clients = clients;

  }
  
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  
  //Render the web part by creating a new React Elementt
  public render(): void {
    const element: React.ReactElement<IProjMgtAdminProps > = React.createElement(
      ProjMgtAdmin,
      {
        adminSiteCollection: this.properties.adminSiteCollection,
        adminListName: this.properties.adminListName,
        clients: this._clients,
        teamsContext: this._teamsContext,
        spContext: this._spContext
      }
    );

    ReactDom.render(element, this.domElement);
  }
}
