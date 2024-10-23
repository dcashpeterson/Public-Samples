import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';
import IntroToSpFxProgressField, { IIntroToSpFxProgressFieldProps } from './components/IntroToSpFxProgressField';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IIntroToSpFxProgressFieldFieldCustomizerProperties {}


export default class IntroToSpFxProgressFieldFieldCustomizer
  extends BaseFieldCustomizer<IIntroToSpFxProgressFieldFieldCustomizerProperties> {

  private LOG_SOURCE: string = "🟢 IntroToSpFxProgressFieldFieldCustomizer";

  public async onInit(): Promise<void> {
    try {
      
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (onInit) - ${err}`);
    }
  }

  public async onRenderCell(event: IFieldCustomizerCellEventParameters): Promise<void> {
    try {
      const props: IIntroToSpFxProgressFieldProps = {
        event: event
      }

      const progressField: React.ReactElement<{}> =
        React.createElement(IntroToSpFxProgressField, props);

      ReactDOM.render(progressField, event.domElement.parentElement);

    } catch (err) {
      console.error(`${this.LOG_SOURCE} (onRenderCell) - ${err}`);
    }
  }

  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }
}
