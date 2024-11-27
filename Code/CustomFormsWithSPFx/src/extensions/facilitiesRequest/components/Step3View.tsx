import HOOLabel from "@n8d/htwoo-react/HOOLabel";
import * as strings from "FacilitiesRequestFormCustomizerStrings";
import * as React from "react";
import { FacilitiesRequestItem } from "../../../common/models/models";

export interface IStep3ViewProps {
  currentItem: FacilitiesRequestItem;
}

export interface IStep3ViewState {
}

export class Step3ViewState implements IStep3ViewState {
  public constructor() { }
}

export default class Step3View extends React.PureComponent<IStep3ViewProps, IStep3ViewState> {
  private LOG_SOURCE = "🟢Step3View";

  public constructor(props: IStep3ViewProps) {
    super(props);
    this.state = new Step3ViewState();
  }

  public render(): React.ReactElement<IStep3ViewProps> {
    try {
      return (

        <fieldset id="resolution" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.resolutionDescriptionLabel} />
            {this.props.currentItem.resolutionDescription}
          </div>

          <div className="hoo-field" role="group">
            <HOOLabel label={strings.resolutionDateLabel} />
            {this.props.currentItem.resolutionDate.toLocaleDateString()}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.inspectionDateLabel} />
            {this.props.currentItem.inspectionDate.toLocaleDateString()}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.requestStatusLabel} />
            {this.props.currentItem.requestStatus}
          </div>
        </fieldset>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div></div>);
    }
  }
}