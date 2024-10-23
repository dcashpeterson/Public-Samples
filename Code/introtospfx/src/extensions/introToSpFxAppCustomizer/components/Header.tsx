import * as React from "react";
import styles from "../IntroToSpFxAppCustomizerApplicationCustomizer.module.scss";

export interface IHeaderProps {
}

export interface IHeaderState {
}

export class HeaderState implements IHeaderState {
  public constructor() { }
}

export default class Header extends React.PureComponent<IHeaderProps, IHeaderState> {
  private LOG_SOURCE = "🟢Header";

  public constructor(props: IHeaderProps) {
    super(props);
    this.state = new HeaderState();
  }

  public render(): React.ReactElement<IHeaderProps> {
    try {
      return (
        <div data-component={this.LOG_SOURCE} className={`${styles.stockTicker} ${styles.up}`}>
          Contoso Stock: +10% 📈, current value $1,000
        </div>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div></div>);
    }
  }
}