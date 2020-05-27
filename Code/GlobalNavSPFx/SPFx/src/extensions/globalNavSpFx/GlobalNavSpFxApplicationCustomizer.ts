import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer, PlaceholderName
} from '@microsoft/sp-application-base';

require('react');
require('react-dom');
require("@dcashpeterson/globalnavcommon");
import { sp } from "@pnp/sp";

import * as strings from 'GlobalNavSpFxApplicationCustomizerStrings';
import Header, { IHeaderProps } from '@dcashpeterson/globalnavcommon/lib/component/Header';
import { IFooterProps, Footer } from '@dcashpeterson/globalnavcommon/lib/component/Footer';
import { Launcher, ILauncher, ILauncherProps, HeaderFooterDataService, IHeaderFooterData } from "@dcashpeterson/globalnavcommon";
const LOG_SOURCE: string = 'GlobalNavSpFxApplicationCustomizer';


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IGlobalNavSpFxApplicationCustomizerProperties {
  // This is an example; replace with your own property
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class GlobalNavSpFxApplicationCustomizer
  extends BaseApplicationCustomizer<IGlobalNavSpFxApplicationCustomizerProperties> {

  private navUrl = 'https://derekcp.sharepoint.com/sites/GlobalNavWithSPFx/Style%20Library/HeaderFooterData.json.txt';
  private navigationData: IHeaderFooterData;

  @override
  public async onInit(): Promise<void> {
    console.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    sp.setup({
      spfxContext: this.context
    });
    await HeaderFooterDataService.get(this.navUrl)
      .then((data: IHeaderFooterData) => {
        this.navigationData = data;
      });
    this.context.application.navigatedEvent.add(this, this.render);

    return Promise.resolve();
  }

  private async render(): Promise<void> {

    try {

      console.info(LOG_SOURCE, `Start [render]`);
      let topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this.onDispose });
      if (topPlaceholder != undefined) {
        console.info(LOG_SOURCE, `starting to render global header! [${strings.Title}]`);
        let topContainer: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
        topPlaceholder.domElement.appendChild(topContainer);

        //Set up header launcher
        const headerProps: IHeaderProps = { links: this.navigationData.headerLinks };
        let navLauncher: ILauncher = new Launcher({
          domElement: topContainer,
          reactControl: Header,
          controlProps: headerProps
        } as ILauncherProps);
        navLauncher.launch();

        console.info(LOG_SOURCE, `Render global header complete [${strings.Title}]`);
      } else {
        console.error(LOG_SOURCE, new Error(`Top Placeholder not available! [${strings.Title}]`));
      }

      //Set up footer
      let bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom, { onDispose: this.onDispose });
      if (bottomPlaceholder != undefined) {
        console.info(LOG_SOURCE, `starting to render global footer! [${strings.Title}]`);
        let bottomContainer: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
        bottomPlaceholder.domElement.appendChild(bottomContainer);

        //Set up footer launcher
        const footerProps: IFooterProps = { links: this.navigationData.footerLinks, message: "Copyright 2020 Contoso Electronics" };
        let navLauncher: ILauncher = new Launcher({
          domElement: bottomContainer,
          reactControl: Footer,
          controlProps: footerProps
        } as ILauncherProps);
        navLauncher.launch();

        console.info(LOG_SOURCE, `Render global footer complete [${strings.Title}]`);
      } else {
        console.error(LOG_SOURCE, new Error(`Top Placeholder not available! [${strings.Title}]`));
      }
    }
    catch (err) {
      console.error(LOG_SOURCE, err);
    }
  }
}
