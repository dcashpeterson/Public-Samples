import { override } from '@microsoft/decorators';
import * as React from "react";
import * as ReactDOM from "react-dom";

import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';

import Header from './components/Header';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IIntroToSpFxAppCustomizerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class IntroToSpFxAppCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<IIntroToSpFxAppCustomizerApplicationCustomizerProperties> {
  private LOG_SOURCE: string = '🟢 IntroToSpFxAppCustomizerApplicationCustomizer';
  private _topPlaceholder: PlaceholderContent | undefined;
  private _elementId: string = "IntroToSpFxAppCustomizerApplicationCustomizer";

  private _waiting: number;
  private _calls = 0;

  public async onInit(): Promise<void>{
    try {
      this.context.application.navigatedEvent.add(this, this._render);
      
      void this._firstLoad();
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (onInit) ${err}`);
    }
  }
  
  private async _firstLoad(): Promise<void> {
    try {
      const stop = (): void => {
        clearInterval(this._waiting);
      };

      //Re-render when ready or calls > 600
      const checkRender = async (): Promise<void> => {
        if (this._calls > 600) {
          stop();
          this.context.application.navigatedEvent.add(this, async () => {
            void this._render();
          });
          void this._render();
        } else {
          this._calls++;
        }
      };

      this._waiting = setInterval(checkRender, 100);
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_firstLoad) ${err}`);
    }
  }
  
  @override
  public async onDispose(): Promise<void> {
    try {
      this.context.application.navigatedEvent.remove(this, this._render);
      ReactDOM.unmountComponentAtNode(this._getTopContainer());
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (onDispose) ${err}`);
    }
    if (this._topPlaceholder && this._topPlaceholder.domElement) {
      this._topPlaceholder.domElement.innerHTML = "";
    }
  }

  private _getTopContainer(): HTMLElement {
      return document.getElementById(this._elementId) as HTMLElement;
  }
  
  private async _render(): Promise<void> {
    try {
      if (!this._topPlaceholder) {
        this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this.onDispose });
      }

      //if a placeholder was retrieved, then we can work with that
      if (this._topPlaceholder !== undefined) {
        //get the nav container we want that would be inside of the SPFx placeholder
        let container = this._getTopContainer();

        //if the container was not found, go and create, then append to spfx top placeholder
        if (container == undefined) {
          //create nav div
          container = document.createElement("DIV");
          container.setAttribute("id", this._elementId);

          //bind to top placeholder
          this._topPlaceholder.domElement.appendChild(container);
        }

        const element = React.createElement(Header, {  });
        ReactDOM.render(element, container);
      }
      else {
        console.error(`${this.LOG_SOURCE}(render) Top Placeholder not available!`);
      }
    }
    catch (err) {
      console.error(`${this.LOG_SOURCE}(render): ${err}`);
    }
  }
}
