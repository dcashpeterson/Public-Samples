require('react');
require('react-dom');
require("@dcashpeterson/globalnavcommon");
import { Launcher, ILauncher, ILauncherProps, HeaderFooterDataService, IHeaderFooterData, Header, Footer } from "@dcashpeterson/globalnavcommon";
import { IHeaderProps } from "@dcashpeterson/globalnavcommon/lib/component/Header";
import { IFooterProps } from "@dcashpeterson/globalnavcommon/lib/component/Footer";

export class bootstrapper {

  public async onInit(): Promise<void> {

    // Create the div elements to hold the header and footer
    const header = document.createElement("div");
    const footer = document.createElement("div");

    // Insert the header and footer on the page
    const ribbon = document.getElementById('s4-ribbonrow');
    const workspace = document.getElementById('s4-workspace');
    if (workspace) {

      ribbon.parentElement.insertBefore(header, ribbon);
      workspace.appendChild(footer);

      // For now this is hard-coded
      // -- UPLOAD JSON WITH MENU CONTENTS AND PUT THE URL HERE --
      const navUrl = 'https://derekcp.sharepoint.com/sites/GlobalNavWithSPFx/Style%20Library/HeaderFooterData.json.txt';
      let navigationData: IHeaderFooterData;

      // Get the header and footer data and render it
      await HeaderFooterDataService.get(navUrl)
        .then((data: IHeaderFooterData) => {
          navigationData = data;
        });

      const headerProps: IHeaderProps = { links: navigationData.headerLinks }
      const footerProps: IFooterProps = { links: navigationData.footerLinks, message: "Copyright 2020 Contoso Electronics" }
      let navLauncher: ILauncher = new Launcher({
        domElement: header,
        reactControl: Header,
        controlProps: headerProps
      } as ILauncherProps);
      navLauncher.launch();

      let footerLauncher: ILauncher = new Launcher({
        domElement: footer,
        reactControl: Footer,
        controlProps: footerProps
      } as ILauncherProps);
      footerLauncher.launch();

    } else {

      // The element we want to attach to is missing
      console.log('Error in CustomHeaderFooterApplicationCustomizer: Unable to find element to attach header and footer');

    }
    return Promise.resolve();
  }
}

// In-line code starts here
(<any>window).ExecuteOrDelayUntilBodyLoaded(() => {
  if (window.location.search.indexOf('IsDlg=1') < 0) {
    let b = new bootstrapper();
    b.onInit();
  }
})
