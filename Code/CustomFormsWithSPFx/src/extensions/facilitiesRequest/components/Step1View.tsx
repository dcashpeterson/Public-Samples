import * as React from "react";
import { FacilitiesRequestItem } from "../../../common/models/models";
import HOOLabel from "@n8d/htwoo-react/HOOLabel";
import * as strings from "FacilitiesRequestFormCustomizerStrings";

export interface IStep1ViewProps {
  currentItem: FacilitiesRequestItem
}

export interface IStep1ViewState {
}

export class Step1ViewState implements IStep1ViewState {
  public constructor() { }
}

export default class Step1View extends React.PureComponent<IStep1ViewProps, IStep1ViewState> {
  private LOG_SOURCE = "🟢Step1View";

  public constructor(props: IStep1ViewProps) {
    super(props);
    this.state = new Step1ViewState();
  }

  public render(): React.ReactElement<IStep1ViewProps> {
    try {
      return (

        <fieldset id="new-item-form" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.issueTypeLabel} />
            {this.props.currentItem.issueType}
          </div>
          <div className="hoo-field stretched" role="group">
            <HOOLabel label={strings.locationLabel} />
            {this.props.currentItem.location}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.equipmentIdLabel} />
            {this.props.currentItem.equipmentId}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.severityLabel} />
            {this.props.currentItem.severity}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.issueDescriptionLabel} />
            {this.props.currentItem.issueDescription}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.reportedByLabel} />
            {this.props.currentItem.reportedBy.displayName}
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.reportedDateLabel} />
            {this.props.currentItem.reportedDate.toLocaleDateString()}
          </div>
        </fieldset>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div></div>);
    }
  }
}