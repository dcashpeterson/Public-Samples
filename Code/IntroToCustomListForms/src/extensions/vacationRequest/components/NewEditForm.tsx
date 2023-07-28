import * as React from "react";
import { FormMode, VacationRequestItem } from "../common/models/models";
import * as strings from "VacationRequestFormCustomizerStrings";
import HOODate from "@n8d/htwoo-react/HOODate";
import { cloneDeep } from "@microsoft/sp-lodash-subset";
import HOOButton from "@n8d/htwoo-react/HOOButton";
import { VRService } from "../common/services/VacationRequest.Service";

export interface INewEditFormProps {
  formMode: FormMode,
  currentItem: VacationRequestItem;
  onSave: () => void;
  onClose: () => void;
}

export interface INewEditFormState {
  currentItem: VacationRequestItem;
}

export class NewEditFormState implements INewEditFormState {
  public constructor(
    public currentItem: VacationRequestItem
  ) { }
}

export default class NewEditForm extends React.PureComponent<INewEditFormProps, INewEditFormState> {
  private LOG_SOURCE = "🔶 NewEditForm";
  private _formDisabled = false;

  public constructor(props: INewEditFormProps) {
    super(props);
    //If the request is approved you can't edit it.
    if ((this.props.currentItem.approvalStatus === "Approved") || (this.props.currentItem.approvalStatus === "Rejected")) {
      this._formDisabled = true;
    }
    //If the request start date has passed you can't edit it.
    const startDate = new Date(this.props.currentItem.startDate);
    const today = new Date();
    if (startDate <= today) {
      this._formDisabled = true;
    }
    this.state = new NewEditFormState(this.props.currentItem);
  }

  private _updateDate = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string): void => {
    try {
      const currentItem: VacationRequestItem = cloneDeep(this.state.currentItem);
      switch (fieldName) {
        case "startDate":
          currentItem.startDate = event.currentTarget.value;
          break;
        case "endDate":
          currentItem.endDate = event.currentTarget.value;
          break;
      }
      this.setState({ currentItem: currentItem });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_updateDate) - ${err}`);
    }
  };

  private _save = async (event: React.MouseEvent<HTMLElement, MouseEvent>, status?: string): Promise<void> => {
    try {
      const currentItem: VacationRequestItem = cloneDeep(this.state.currentItem);
      if (this.props.formMode === FormMode.NEWVIEW) {
        await VRService.SaveItem(this.state.currentItem);
      } else {
        if (status) {
          currentItem.approvalStatus = status;
        }
        await VRService.UpdateItem(this.state.currentItem);
      }
      //this.setState({ currentItem: currentItem });
      this.props.onSave();
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_updateDate) - ${err}`);
    }
  };

  private _cancel = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    try {
      const currentItem: VacationRequestItem = cloneDeep(this.props.currentItem);
      this.setState({ currentItem: currentItem });
      this.props.onClose();
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_updateDate) - ${err}`);
    }
  };

  public render(): React.ReactElement<INewEditFormProps> {
    try {
      return (
        <div data-component={this.LOG_SOURCE}>
          <div className="hoo-grid inputForm">
            <div className="intro">{(this.props.formMode === FormMode.NEWVIEW) ? strings.NewFormIntro : strings.EditFormIntro}</div>
            {(this._formDisabled) &&
              <div className="intro hoo-error">{strings.FormDisabled}</div>
            }
            <div className="label">{strings.StartDateLabel}</div>
            <div className="input"><HOODate
              onChange={(event) => { this._updateDate(event, "startDate"); }}
              value={this.state.currentItem.startDate}
              disabled={this._formDisabled}
            /></div>
            <div className="label">{strings.EndDateLabel}</div>
            <div className="input"><HOODate
              onChange={(event) => { this._updateDate(event, "endDate"); }}
              value={this.state.currentItem.endDate}
              disabled={this._formDisabled}
            /></div>
            {(this.props.currentItem.approverId === VRService.currentUser.Id) &&
              <>
                <div className="label"><HOOButton
                  label={strings.Approve}
                  onClick={async (event) => { await this._save(event, "Approved"); }}
                  type={1}
                  disabled={this._formDisabled}
                /></div>
                <div className="input"><HOOButton
                  label={strings.Reject}
                  onClick={(event) => { this._save(event, "Rejected"); }}
                  type={1}
                /></div>
              </>
            }
            {(this.props.currentItem.requestorId === VRService.currentUser.Id) &&
              <>
                <div className="label"><HOOButton
                  label={strings.Save}
                  onClick={async (event) => { await this._save(event); }}
                  type={1}
                  disabled={this._formDisabled}
                /></div>
                <div className="input"><HOOButton
                  label={strings.Cancel}
                  onClick={(event) => { this._cancel(event); }}
                  type={1}
                /></div>
              </>
            }


          </div>
        </div>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return null;
    }
  }
}