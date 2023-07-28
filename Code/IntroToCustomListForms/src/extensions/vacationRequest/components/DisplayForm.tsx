// import HOOPivotBar from "@n8d/htwoo-react/HOOPivotBar";
// import HOOTable, { HOOTableStyle } from "@n8d/htwoo-react/HOOTable";
import * as React from "react";
import { VacationRequestItem } from "../common/models/models";
//import styles from "./VacationRequest.module.scss";
//import * as strings from "VacationRequestFormCustomizerStrings";
//import HOOButtonCommand from "@n8d/htwoo-react/HOOButtonCommand";

export interface IDisplayFormProps {
  requests: VacationRequestItem[];
  currentItem: VacationRequestItem;
  updateRequests: (approvalStatus: string) => void;
  changeForm: (modeID: number) => void;
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


  public constructor(props: IDisplayFormProps) {
    super(props);
    this.state = new DisplayFormState(); //this._getSelectedMenu(this.props.currentItem.approvalStatus));
  }

  // private _getSelectedMenu(approvalStatus: string): string | number {
  //   let retVal: string | number = 0;
  //   try {
  //     switch (approvalStatus) {
  //       case "Pending":
  //         retVal = 2;
  //         break;
  //       case "Approved":
  //         retVal = 3;
  //         break;
  //       case "Rejected":
  //         retVal = 4;
  //         break;
  //       default:
  //         break;
  //     }
  //   } catch (err) {
  //     console.error(`${this.LOG_SOURCE} (_getSelectedMenu) - ${err}`);
  //   }
  //   return retVal;
  // }
  // private _getApproverString(approvalStatus: string, approverDisplayName: string): string {
  //   let retVal: string = strings.NewStatusMessage;
  //   try {
  //     switch (approvalStatus) {
  //       case "Pending":
  //         retVal = `${strings.PendingStatusMessage} ${approverDisplayName}`
  //         break;
  //       case "Approved":
  //         retVal = `${strings.ApprovedStatusMessage} ${approverDisplayName}`
  //         break;
  //       case "Rejected":
  //         retVal = `${strings.RejectedStatusMessage} ${approverDisplayName}`
  //         break;
  //     }
  //   } catch (err) {
  //     console.error(`${this.LOG_SOURCE} (_getApproverString) - ${err}`);
  //   }
  //   return retVal
  // }

  // private _onPivotClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, key: string | number): void => {
  //   try {
  //     let approvalStatus = "";
  //     switch (key) {
  //       case 2:
  //         approvalStatus = "Pending";
  //         break;
  //       case 3:
  //         approvalStatus = "Approved";
  //         break;
  //       case 4:
  //         approvalStatus = "Rejected";
  //         break;
  //     }
  //     this.props.updateRequests(approvalStatus);
  //     this.setState({ selectedKey: key });
  //   } catch (err) {
  //     console.error(`${this.LOG_SOURCE} (_onPivotClick) - ${err}`);
  //   }
  // }

  // private _addRequestClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, formMode: number): void => {
  //   try {
  //     this.props.changeForm(formMode)
  //   } catch (err) {
  //     console.error(`${this.LOG_SOURCE} (_addRequestClick) - ${err}`);
  //   }
  // }

  public async render(): Promise<React.ReactElement<IDisplayFormProps>> {

    try {
      return (
        <div data-component={this.LOG_SOURCE}>
          asdasdasd

        </div>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return null;
    }
  }
}