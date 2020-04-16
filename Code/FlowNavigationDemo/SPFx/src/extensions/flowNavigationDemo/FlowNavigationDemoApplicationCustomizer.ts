// SPFx imports
import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer, PlaceholderName, ApplicationCustomizerContext
} from '@microsoft/sp-application-base';

import HeaderFooterDataService from './common/services/HeaderFooterDataService';
import IHeaderFooterData from './common/model/IHeaderFooterData';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as strings from 'FlowNavigationDemoApplicationCustomizerStrings';
import { sp } from "@pnp/sp";
import { Logger, LogLevel } from "@pnp/logging";
import { Header } from './common/components/Header';

const LOG_SOURCE: string = 'FlowNavigationDemoApplicationCustomizer';

export interface IFlowNavigationDemoApplicationCustomizerProperties {
  Top: string;
  Bottom: string;
}


///This code is adapted from the PnP SPFx Dev Extension Library
///React Menu Footer Classic Modern
///https://github.com/SharePoint/sp-dev-fx-extensions/tree/master/samples/react-menu-footer-classic-modern

export default class FlowNavigationDemoApplicationCustomizer
  extends BaseApplicationCustomizer<IFlowNavigationDemoApplicationCustomizerProperties> {

  //Set up private variables to use later
  private topElementId: string = "FlowNavigationDemoApplicationCustomizerHeader";
  private bottomElementId: string = "FlowNavigationDemoApplicationCustomizerFooter";
  private className = "FlowNavigationDemoApplicationContainer";
  private navigationData: IHeaderFooterData;
  private navUrl = 'https://derekcp.sharepoint.com/sites/TheLanding/Style%20Library/HeaderFooterData.json.txt';

  @override
  public onInit(): Promise<void> {
    //Set up SPFX for use later
    sp.setup({
      spfxContext: this.context
    });

    //Call the Service that gets the data from the JSON file
    HeaderFooterDataService.get(this.navUrl)
      .then((data: IHeaderFooterData) => {
        //Set the data to the navigationData object
        this.navigationData = data;
      });
    this.render();
    return Promise.resolve();
  }

  @override
  public onDispose(): Promise<void> {
    //Deal with the partial page reload issue
    this.context.application.navigatedEvent.remove(this, this.navigationEventHandler);

    (window as any).isNavigatedEventSubscribed = false;
    (window as any).currentPage = '';
    return Promise.resolve();
  }

  private navigationEventHandler(): void {
    //Deal with the partial page reload issue
    setTimeout(() => {
      try {
        if ((window as any).isNavigatedEventSubscribed && (window as any).currentPage !== window.location.href) {
          (window as any).currentPage = window.location.href;
          this.render();
        }
      } catch (err) {
        Logger.write(`${err} [${LOG_SOURCE}]`, LogLevel.Error);
      }
    }, 50);
  }

  //Get the container of the extension by ID
  private getContainer(elementId: string): HTMLElement {
    return document.getElementById(elementId);
  }

  //Delete the container of the extention by ID
  private deleteContainer(elementId: string) {
    let container = this.getContainer(elementId);
    Logger.write(`Deleting existing ${elementId} Container! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Info);
    container.parentNode.removeChild(container);
  }

  private render(): void {
    let error = false;
    //Check if you the placeholder is there. If not throw an error.
    try {
      if (this.context.placeholderProvider.tryCreateContent == undefined) {
        error = true;
      }
    } catch (err) {
      error = true;
    }

    //If there is a placeholder then register the Navigation Event to avoid multiple loading.
    if (error) {
      (window as any).currentPage = '';
      this.navigationEventHandler();
    } else {
      if (!(window as any).isNavigatedEventSubscribed) {
        this.context.application.navigatedEvent.add(this, this.navigationEventHandler);
        (window as any).isNavigatedEventSubscribed = true;
      }
      this.renderContainer(this.context);
    }
  }

  //Check to see if the component is installed.
  private async isInstalled(): Promise<boolean> {
    try {
      //Gets the component by Title. This is the title in the ClientSideInstance.xml file
      let response = await sp.web.userCustomActions.filter("Title eq 'FlowNavigationDemo'").get();
      //let x = await sp.web.userCustomActions.get();
      if (response != undefined && response.length > 0) {
        return true;
      }
      else {
        return false;
      }
    } catch (err) {
      Logger.write(`${err} [isInstalled - ${LOG_SOURCE}]`, LogLevel.Error);
    }
  }

  //Render compopnents
  private async renderContainer(context: ApplicationCustomizerContext): Promise<void> {
    try {
      //Check if the compoent is installed
      let isInstalled = await this.isInstalled();
      if (isInstalled) {
        //Create a reference to the top placeholder
        let placeholder = context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this.onDispose });
        if (placeholder != undefined) {
          Logger.write(`Rendering picker! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Info);
          //Check if the container exists if not create it
          let container = this.getContainer(this.topElementId);
          if (container == undefined) {
            container = document.createElement("DIV");
            container.setAttribute("id", this.topElementId);
            container.className = this.className;
            placeholder.domElement.appendChild(container);
          }
          //Create Header Element and pass in header data
          let element = React.createElement(Header, { links: this.navigationData.headerLinks });
          let elements: any = [];
          elements.push(element);
          ReactDOM.render(elements, container);

        } else {
          Logger.write(`Top Placeholder not available! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Error);
        }

        placeholder = undefined;
        //Create a reference to the bottom placeholder
        placeholder = context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom, { onDispose: this.onDispose });
        if (placeholder != undefined) {
          Logger.write(`Rendering picker! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Info);
          //Check if the container exists if not create it
          let container = this.getContainer(this.bottomElementId);
          if (container == undefined) {
            container = document.createElement("DIV");
            container.setAttribute("id", this.bottomElementId);
            container.className = this.className;
            placeholder.domElement.appendChild(container);
          }
          //Create Header Element and pass in footer data
          let element = React.createElement(Header, { links: this.navigationData.footerLinks });
          let elements: any = [];
          elements.push(element);
          ReactDOM.render(elements, container);

        } else {
          Logger.write(`Bottom Placeholder not available! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Error);
        }
      } else {
        //if it already exists remove it
        this.deleteContainer(this.topElementId);
        this.deleteContainer(this.bottomElementId);
      }
    }
    catch (err) {
      Logger.write(`${err} [render - ${LOG_SOURCE}]`, LogLevel.Error);
    }
  }

}
