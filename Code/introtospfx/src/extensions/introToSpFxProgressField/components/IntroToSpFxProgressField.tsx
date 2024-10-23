import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';

import styles from './IntroToSpFxProgressField.module.scss';
import { IFieldCustomizerCellEventParameters } from '@microsoft/sp-listview-extensibility';

export interface IIntroToSpFxProgressFieldProps {
  event: IFieldCustomizerCellEventParameters;
}

const LOG_SOURCE: string = 'IntroToSpFxProgressField';

export default class IntroToSpFxProgressField extends React.Component<IIntroToSpFxProgressFieldProps, {}> {
  private readonly _maxLowLevel = 30;
  private readonly _maxMiddleLevel = 70;

  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: IntroToSpFxProgressField mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: IntroToSpFxProgressField unmounted');
  }

  public render(): React.ReactElement<{}> {
    // Determine the type: low/middle/top
    let typeClass;
    if (this.props.event.fieldValue <= this._maxLowLevel) {
      typeClass = styles.lowLevel;
    } else if (this.props.event.fieldValue <= this._maxMiddleLevel) {
      typeClass = styles.middleLevel;
    } else {
      typeClass = styles.topLevel;
    }

    // const progressBar = this.props.event.domElement;
    // if (progressBar) {
    //   // Animate the initial progress grow
    //   progressBar.animate(
    //     [
    //       // keyframes
    //       { width: '0' },
    //       { width: this.props.event.fieldValue + '%' },
    //     ],
    //     {
    //       // timing options
    //       duration: 1000,
    //       iterations: 1,
    //     }
    //   );
    // }
    const cardStyle: React.CSSProperties = {
      animationName: 'progress',
      animationDuration: '3000ms',
      animationIterationCount: '1',
    };
    return (
      <>
        <style>
          {`@keyframes progress{0%{width:0},100%{width:${this.props.event.fieldValue}}}`}
        </style>
        <div className={`${styles.progress} ${typeClass}`} style={cardStyle}>

          <span style={{ width: `${this.props.event.fieldValue}` }}>{this.props.event.fieldValue}</span>
        </div >
      </>

    );
  }
}
