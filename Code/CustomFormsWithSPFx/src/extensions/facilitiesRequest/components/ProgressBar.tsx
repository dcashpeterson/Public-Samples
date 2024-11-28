import * as strings from "FacilitiesRequestFormCustomizerStrings";
import * as React from "react";

export interface IProgressBarProps {
  progress: number;
}

export interface IProgressBarState {
}

export class ProgressBarState implements IProgressBarState {
  public constructor() { }
}

export default class ProgressBar extends React.PureComponent<IProgressBarProps, IProgressBarState> {
  private LOG_SOURCE = "🟢ProgressBar";

  public constructor(props: IProgressBarProps) {
    super(props);
    this.state = new ProgressBarState();
  }

  public render(): React.ReactElement<IProgressBarProps> {
    try {
      return (
        <div className="hoo-progress-stepbar" data-component={this.LOG_SOURCE}>
          <progress className="hoo-progress-bar" value={this.props.progress} max="100">
            {this.props.progress}%
          </progress>
          <div className="hoo-progress-step" style={{ '--step-offset': '25%' } as React.CSSProperties}>
            <div className="inner">
              <div className="hoo-progress-step-indicator" />
              <div className="hoo-progress-step-label">
                {strings.reportedIssueHeader}
              </div>
            </div>
          </div>
          <div className="hoo-progress-step" style={{ '--step-offset': '50%' } as React.CSSProperties}>
            <div className="inner">
              <div className="hoo-progress-step-indicator" />
              <div className="hoo-progress-step-label">
                {strings.reviewAssignHeader}
              </div>
            </div>
          </div>
          <div className="hoo-progress-step" style={{ '--step-offset': '75%' } as React.CSSProperties}>
            <div className="inner">
              <div className="hoo-progress-step-indicator" />
              <div className="hoo-progress-step-label">
                {strings.issueResolutionHeader}
              </div>
            </div>
          </div>
          <div className="hoo-progress-step" style={{ '--step-offset': '100%' } as React.CSSProperties}>
            <div className="inner">
              <div className="hoo-progress-step-indicator" />
              <div className="hoo-progress-step-label">
                Completed
              </div>
            </div>
          </div>
        </div>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div>There was an error rendering Progress Bar {err}</div>);
    }
  }
}