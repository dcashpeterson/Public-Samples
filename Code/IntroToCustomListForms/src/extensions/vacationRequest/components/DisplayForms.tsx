import * as React from "react";
import { VacationRequestItem } from "../common/models/models";
import HOOPivotBar from "@n8d/htwoo-react/HOOPivotBar";
import styles from "./VacationRequest.module.scss";
import HOOButtonCommand from "@n8d/htwoo-react/HOOButtonCommand";
import HOOTable, { HOOTableStyle } from "@n8d/htwoo-react/HOOTable";
import * as strings from "VacationRequestFormCustomizerStrings";
import { VRService } from "../common/services/VacationRequest.Service";

export interface IDisplayFormsProps {
  requests: VacationRequestItem[];
  currentItem: VacationRequestItem;
  updateRequests: (approvalStatus: string) => void;
  changeForm: (modeID: number) => void;
}

export interface IDisplayFormsState {
  selectedKey: string | number;
}

export class DisplayFormsState implements IDisplayFormsState {
  public constructor(
    public selectedKey: string | number = 1
  ) { }
}

export default class DisplayForms extends React.PureComponent<IDisplayFormsProps, IDisplayFormsState> {
  private LOG_SOURCE = "🔶 DisplayForms";

  public constructor(props: IDisplayFormsProps) {
    super(props);
    const selectedMenu: string | number = this._getSelectedMenu(this.props.currentItem.approvalStatus);
    this.state = new DisplayFormsState(selectedMenu);
  }

  private _getSelectedMenu(approvalStatus: string): string | number {
    let retVal: string | number = 0;
    try {
      switch (approvalStatus) {
        case "Pending":
          retVal = 2;
          break;
        case "Approved":
          retVal = 3;
          break;
        case "Rejected":
          retVal = 4;
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_getSelectedMenu) - ${err}`);
    }
    return retVal;
  }

  private _onPivotClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, key: string | number): void => {
    try {
      let approvalStatus = "";
      switch (key) {
        case 2:
          approvalStatus = "Pending";
          break;
        case 3:
          approvalStatus = "Approved";
          break;
        case 4:
          approvalStatus = "Rejected";
          break;
      }
      this.props.updateRequests(approvalStatus);
      this.setState({ selectedKey: key });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_onPivotClick) - ${err}`);
    }
  }

  private _addRequestClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, formMode: number): void => {
    try {
      this.props.changeForm(formMode)
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_addRequestClick) - ${err}`);
    }
  }

  private _getApproverString(approvalStatus: string, approverDisplayName: string): string {
    let retVal: string = strings.NewStatusMessage;
    try {
      switch (approvalStatus) {
        case "Pending":
          retVal = `${strings.PendingStatusMessage} ${approverDisplayName}`
          break;
        case "Approved":
          retVal = `${strings.ApprovedStatusMessage} ${approverDisplayName}`
          break;
        case "Rejected":
          retVal = `${strings.RejectedStatusMessage} ${approverDisplayName}`
          break;
      }
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_getApproverString) - ${err}`);
    }
    return retVal
  }

  public render(): React.ReactElement<IDisplayFormsProps> {
    try {
      return (
        <div data-component={this.LOG_SOURCE}>
          <div className="header">
            <HOOPivotBar
              onClick={(event, selectedKey) => { this._onPivotClick(event, selectedKey); }}
              pivotItems={[
                {
                  key: 2,
                  text: 'Pending'
                },
                {
                  key: 3,
                  text: 'Approved'
                },
                {
                  key: 4,
                  text: 'Rejected'
                }
              ]}
              selectedKey={this.state.selectedKey}
            />
            <div className={styles.newButton}>
              <HOOButtonCommand
                flyoutMenuItems={[]}
                label="Add New Request"
                onClick={(event) => { this._addRequestClick(event, 8); }}
              />
            </div>
          </div>
          <HOOTable tableStyle={HOOTableStyle.Normal}>
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Approval Status</th>
                <th>Comments</th>
                {(this.props.currentItem.approverId === VRService.currentUser.Id) &&
                  <th>Approve/Reject</th>
                }
              </tr>
            </thead>
            <tbody>
              {(this.props.requests.length > 0) &&
                this.props.requests.map((item, index) => {
                  return (
                    <tr key={index} className={(item.id === this.props.currentItem.id) ? "current" : ""}>
                      <td>{new Date(item.startDate).toLocaleDateString()}</td>
                      <td>{new Date(item.endDate).toLocaleDateString()}</td>
                      <td>{item.approvalStatus}</td>
                      <td>{this._getApproverString(item.approvalStatus, item.approverDisplayName)}</td>
                      {((this.props.currentItem.approverId === VRService.currentUser.Id)) &&
                        <td>asd</td>
                      }


                    </tr>);
                })
              }
              {(this.props.requests.length <= 0) &&
                <tr>
                  <td colSpan={4}>{strings.NoResultsMessage}</td>
                </tr>
              }

            </tbody>
          </HOOTable>
        </div>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return null;
    }
  }
}