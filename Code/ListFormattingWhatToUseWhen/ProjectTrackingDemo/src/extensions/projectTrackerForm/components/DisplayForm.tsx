// import HOOPivotBar from "@n8d/htwoo-react/HOOPivotBar";
// import HOOTable, { HOOTableStyle } from "@n8d/htwoo-react/HOOTable";
import * as React from "react";
import { ProjectTrackerItem } from "../common/models/models";
import * as strings from "ProjectTrackerFormFormCustomizerStrings";
import HOOButton from "@n8d/htwoo-react/HOOButton";
import HOODate from "@n8d/htwoo-react/HOODate";
//import styles from "./VacationRequest.module.scss";
//import * as strings from "VacationRequestFormCustomizerStrings";
//import HOOButtonCommand from "@n8d/htwoo-react/HOOButtonCommand";

export interface IDisplayFormProps {
  currentItem: ProjectTrackerItem;
  changeForm: (modeID: number) => void;
  onClose: () => void;
}

export interface IDisplayFormState {
  //selectedKey: string | number;
}

export class DisplayFormState implements IDisplayFormState {
  public constructor(
    //public selectedKey: string | number = 1,
  ) { }
}

export default class DisplayForm extends React.PureComponent<IDisplayFormProps, IDisplayFormState> {
  private LOG_SOURCE = "🔶 DisplayForm";
  private _overdue: boolean = false;


  public constructor(props: IDisplayFormProps) {
    super(props);
    const dueDate: Date = new Date(this.props.currentItem.dueDate);
    const today: Date = new Date();
    if (dueDate.toISOString() <= today.toISOString()) {
      this._overdue = true;
    }
    this.state = new DisplayFormState(); //this._getSelectedMenu(this.props.currentItem.approvalStatus));
  }

  private _cancel = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    try {
      this.setState({ currentItem: this.props.currentItem });
      this.props.onClose();
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_updateDate) - ${err}`);
    }
  };

  private _changeForm = (event: React.MouseEvent<HTMLElement, MouseEvent>, formMode: number): void => {
    try {
      this.props.changeForm(formMode)
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_addRequestClick) - ${err}`);
    }
  }

  public render(): React.ReactElement<IDisplayFormProps> {
    try {
      return (
        <div data-component={this.LOG_SOURCE}>
          <div className="hoo-grid inputForm">
            <div className={`header ${this._overdue ? " overdue" : ""}`}>
              <h2 className="title">{this.props.currentItem.title}</h2>
              <div className="icons">
                <HOOButton
                  iconName="icon-edit-regular"
                  onClick={(event) => { this._changeForm(event, 6); }}
                  type={0}
                />
                <HOOButton
                  iconName="icon-dismiss-regular"
                  onClick={(event) => { this._cancel(event); }}
                  type={0}
                />
              </div>
              {this._overdue &&
                <>
                  <div className="fullWidth">{strings.OverDueNotice}</div>
                </>
              }
            </div>
            <div className="label">{strings.DescriptionLabel}</div>
            <div className="input">{this.props.currentItem.description}</div>
            <div className="label">{strings.AssignedToLabel}</div>
            <div className="input"><a href={`mailto:${this.props.currentItem.assignee.email}`}>{this.props.currentItem.assignee.displayName}</a></div>
            <div className="label">Task Dates</div>
            <div className="label">{strings.StartDateLabel}</div>
            <div className="input">
              <div className="threeCol">
                <div className="col1">
                  <HOODate
                    value={this.props.currentItem.startDate}
                    disabled={true}
                    onChange={() => { }}
                  />
                </div>
                <div className="col2">{strings.DueDateLabel}</div>
                <div className="col3"><HOODate
                  value={this.props.currentItem.dueDate}
                  disabled={true}
                  onChange={() => { }} /></div>
              </div>
            </div>
            <div className="callOut">
              <div className="intro">Task Status</div>
              <div className="label">{strings.CategoryLabel}</div>
              <div className="input">
                <div className="threeCol">
                  <div className="col1 white">
                    {this.props.currentItem.category}
                  </div>
                  <div className="col2 spacing">{strings.PriorityLabel}</div>
                  <div className="col3 white">{this.props.currentItem.priority}</div>
                </div>
              </div>
              <div className="label">{strings.ProgressLabel}</div>
              <div className="input">
                <div className="threeCol">
                  <div className="col1 white">
                    {this.props.currentItem.progress}
                  </div>
                  <div className="col2"></div>
                  <div className="col3"></div>
                </div>
              </div>
            </div>

            <div className="label">{strings.NotesLabel}</div>
            <div className="input">{this.props.currentItem.notes}
            </div>
          </div>
        </div>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return null;
    }
  }
}