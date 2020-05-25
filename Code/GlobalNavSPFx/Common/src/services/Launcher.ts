import React from "react";
import ReactDOM from "react-dom";

export interface ILauncherProps {
  domElement: HTMLDivElement; //dom element to bind nav
  reactControl: any;
  controlProps: any;
}

export interface ILauncher {
  launch: () => void;
}

export class Launcher implements ILauncher {
  private domElementHeader: HTMLDivElement;
  private reactControl: any;
  private controlProps: any;

  constructor(props: ILauncherProps) {
    console.log("Launcher constructor");
    try {
      this.domElementHeader = props.domElement;
      this.reactControl = props.reactControl;
      this.controlProps = props.controlProps;

    } catch (err) {
      console.error(`Launcher (constructor) ${err}`);
    }
  }

  public launch(): void {
    console.log("Launcher launch");
    this.renderHeader();
  }

  private renderHeader(): void {
    console.log("Launcher render");
    try {

      const container = React.createElement(this.reactControl, this.controlProps, null);
      //render
      ReactDOM.render(container, this.domElementHeader);
      console.log("Launcher render complete");
    } catch (err) {
      console.error(`Launcher (renderHeader) ${err}`);
    }
  }
}
