// SPFx imports
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName, ApplicationCustomizerContext
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import { escape } from '@microsoft/sp-lodash-subset';

import HeaderFooterDataService from './common/services/HeaderFooterDataService';
import IHeaderFooterData from './common/model/IHeaderFooterData';
import ComponentManager from './common/components/ComponentManager';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as strings from 'FlowNavigationDemoApplicationCustomizerStrings';
import { sp } from "@pnp/sp";
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { Header } from './common/components/Header';

const LOG_SOURCE: string = 'FlowNavigationDemoApplicationCustomizer';


export interface IFlowNavigationDemoApplicationCustomizerProperties {
  Top: string;
  Bottom: string;
}

export default class FlowNavigationDemoApplicationCustomizer
  extends BaseApplicationCustomizer<IFlowNavigationDemoApplicationCustomizerProperties> {

  private topElementId: string = "FlowNavigationDemoApplicationCustomizerHeader";
  private bottomElementId: string = "FlowNavigationDemoApplicationCustomizerFooter";
  private className = "FlowNavigationDemoApplicationContainer";
  private navigationData: IHeaderFooterData;
  private navUrl = 'https://derekcp.sharepoint.com/sites/TheLanding/Style%20Library/HeaderFooterData.json.txt';

  @override
  public onInit(): Promise<void> {
    sp.setup({
      spfxContext: this.context
    });
    HeaderFooterDataService.get(this.navUrl)
      .then((data: IHeaderFooterData) => {
        this.navigationData = data;
      });
    this.render();
    return Promise.resolve();
  }

  @override
  public onDispose(): Promise<void> {
    this.context.application.navigatedEvent.remove(this, this.navigationEventHandler);

    (window as any).isNavigatedEventSubscribed = false;
    (window as any).currentPage = '';
    return Promise.resolve();
  }

  private navigationEventHandler(): void {
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

  private getContainer(elementId: string): HTMLElement {
    return document.getElementById(elementId);
  }

  private deleteContainer(elementId: string) {
    let container = this.getContainer(elementId);
    Logger.write(`Deleting existing ${elementId} Container! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Info);
    container.parentNode.removeChild(container);
  }

  private render(): void {
    let error = false;
    try {
      if (this.context.placeholderProvider.tryCreateContent == undefined) {
        error = true;
      }
    } catch (err) {
      error = true;
    }

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

  private async isInstalled(): Promise<boolean> {
    try {
      let response = await sp.web.userCustomActions.filter("Title eq 'FlowNavigationDemo'").get();
      let x = await sp.web.userCustomActions.get();
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

  private async renderContainer(context: ApplicationCustomizerContext): Promise<void> {
    try {
      let isInstalled = await this.isInstalled();
      if (isInstalled) {
        let placeholder = context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this.onDispose });
        if (placeholder != undefined) {
          Logger.write(`Rendering picker! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Info);
          let container = this.getContainer(this.topElementId);
          if (container == undefined) {
            container = document.createElement("DIV");
            container.setAttribute("id", this.topElementId);
            container.className = this.className;
            placeholder.domElement.appendChild(container);
          }
          let element = React.createElement(Header, { links: this.navigationData.headerLinks });
          let elements: any = [];
          elements.push(element);
          ReactDOM.render(elements, container);

        } else {
          Logger.write(`Top Placeholder not available! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Error);
        }

        placeholder = undefined;

        placeholder = context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom, { onDispose: this.onDispose });
        if (placeholder != undefined) {
          Logger.write(`Rendering picker! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Info);
          let container = this.getContainer(this.bottomElementId);
          if (container == undefined) {
            container = document.createElement("DIV");
            container.setAttribute("id", this.bottomElementId);
            container.className = this.className;
            placeholder.domElement.appendChild(container);
          }
          let element = React.createElement(Header, { links: this.navigationData.footerLinks });
          let elements: any = [];
          elements.push(element);
          ReactDOM.render(elements, container);

        } else {
          Logger.write(`Bottom Placeholder not available! [${strings.Title} - ${LOG_SOURCE}]`, LogLevel.Error);
        }
      } else {
        this.deleteContainer(this.topElementId);
        this.deleteContainer(this.bottomElementId);
      }
    }
    catch (err) {
      Logger.write(`${err} [render - ${LOG_SOURCE}]`, LogLevel.Error);
    }
  }

}
