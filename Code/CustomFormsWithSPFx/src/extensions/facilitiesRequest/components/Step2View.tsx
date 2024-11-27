import * as React from "react";
import { FacilitiesRequestItem } from "../../../common/models/models";
import HOOLabel from "@n8d/htwoo-react/HOOLabel";
import * as strings from "FacilitiesRequestFormCustomizerStrings";

export interface IStep2ViewProps {
  currentItem: FacilitiesRequestItem;
}

export interface IStep2ViewState {
}

export class Step2ViewState implements IStep2ViewState {
  public constructor() { }
}

export default class Step2View extends React.PureComponent<IStep2ViewProps, IStep2ViewState> {
  private LOG_SOURCE = "🟢Step2View";

  public constructor(props: IStep2ViewProps) {
    super(props);
    this.state = new Step2ViewState();
  }

  public render(): React.ReactElement<IStep2ViewProps> {
    try {
      return (
        <fieldset id="issue-verification" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.assigneeLabel} />
            {this.props.currentItem.assignee.displayName}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.verificationDateLabel} />
            {this.props.currentItem.verificationDate.toLocaleDateString()}
          </div>

          <div className="hoo-field" role="group">
            <HOOLabel label={strings.additionalCommentsLabel} />
            {this.props.currentItem.additionalComments}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.estimatedResolutionDateLabel} />
            {this.props.currentItem.estimatedResolutionDate.toLocaleDateString()}
          </div>
        </fieldset>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div></div>);
    }
  }
}