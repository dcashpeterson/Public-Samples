import * as React from "react";
import { Assignee, FormMode, ProjectTrackerItem } from "../common/models/models";
import * as strings from "ProjectTrackerFormFormCustomizerStrings";
import HOODate from "@n8d/htwoo-react/HOODate";
import { cloneDeep } from "@microsoft/sp-lodash-subset";
import HOOButton from "@n8d/htwoo-react/HOOButton";
import { PTService } from "../common/services/ProjectTracker.Service";
import HOOText from "@n8d/htwoo-react/HOOText";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import HOODropDown from "@n8d/htwoo-react/HOODropDown";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { IWebEnsureUserResult } from "@pnp/sp/site-users/";

export interface INewEditFormProps {
  context: FormCustomizerContext,
  formMode: FormMode,
  currentItem: ProjectTrackerItem;
  onSave: () => void;
  onClose: () => void;
}

export interface INewEditFormState {
  currentItem: ProjectTrackerItem;
}

export class NewEditFormState implements INewEditFormState {
  public constructor(
    public currentItem: ProjectTrackerItem
  ) { }
}

export default class NewEditForm extends React.PureComponent<INewEditFormProps, INewEditFormState> {
  private LOG_SOURCE = "🔶 NewEditForm";

  public constructor(props: INewEditFormProps) {
    super(props);
    this.state = new NewEditFormState(this.props.currentItem);
  }

  private _updateField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string): void => {
    try {
      const currentItem: any = cloneDeep(this.state.currentItem);
      currentItem[fieldName] = event.currentTarget.value;
      this.setState({ currentItem: currentItem });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_updateString) - ${err}`);
    }
  };

  private _updateDropDown = (fieldValue: string | number, fieldName: string): void => {
    try {
      const currentItem: any = cloneDeep(this.state.currentItem);
      currentItem[fieldName] = fieldValue;
      this.setState({ currentItem: currentItem });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_updateDropDown) - ${err}`);
    }
  }

  private _updatePeoplePicker = async (items: any[]): Promise<void> => {
    const currentItem: any = cloneDeep(this.state.currentItem);
    const user: IWebEnsureUserResult = await PTService.EnsureUser(items[0].id);
    const assignee: Assignee = new Assignee(
      user.data.Id,
      items[0].text,
      items[0].secondaryText,
      items[0].secondaryText,
    )
    currentItem.assignee = assignee;
    this.setState({ currentItem: currentItem });
    console.log(items);
  }

  private _save = async (event: React.MouseEvent<HTMLElement, MouseEvent>): Promise<void> => {
    try {
      if (this.props.formMode === FormMode.NEWVIEW) {
        await PTService.SaveItem(this.state.currentItem);
      } else {
        await PTService.UpdateItem(this.state.currentItem);
      }
      this.props.onSave();
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_updateDate) - ${err}`);
    }
  };

  private _cancel = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    try {
      this.setState({ currentItem: this.props.currentItem });
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
            <div className="label">{strings.TitleLabel}</div>
            <div className="input"><HOOText
              onChange={(event) => { this._updateField(event, "title"); }}
              value={this.state.currentItem.title} />
            </div>
            <div className="label">{strings.DescriptionLabel}</div>
            <div className="input"><HOOText
              onChange={(event) => { this._updateField(event, "description"); }}
              value={this.state.currentItem.description}
              multiline={6} />
            </div>
            <div className="label">{strings.AssignedToLabel}</div>
            <div className="input"><PeoplePicker
              context={this.props.context as any}
              titleText=""
              personSelectionLimit={3}
              showtooltip={true}
              required={false}
              disabled={false}
              onChange={this._updatePeoplePicker}
              principalTypes={[PrincipalType.User]}
              resolveDelay={1000}
              defaultSelectedUsers={[this.state.currentItem.assignee.loginName]} />
            </div>
            <div className="label">Task Dates</div>
            <div className="input">Please ensure your task start and due dates are correct. This helps us plan people's time. </div>
            <div className="label">{strings.StartDateLabel}</div>
            <div className="input">
              <div className="threeCol">
                <div className="col1">
                  <HOODate
                    onChange={(event) => { this._updateField(event, "startDate"); }}
                    value={this.state.currentItem.startDate} />
                </div>
                <div className="col2">{strings.DueDateLabel}</div>
                <div className="col3"><HOODate
                  onChange={(event) => { this._updateField(event, "dueDate"); }}
                  value={this.state.currentItem.dueDate} /></div>
              </div>
            </div>
            <div className="callOut">
              <div className="intro">Task Status</div>
              <div className="label">{strings.CategoryLabel}</div>
              <div className="input">
                <div className="threeCol">
                  <div className="col1">
                    <HOODropDown
                      onChange={(event) => { this._updateDropDown(event, "category") }}
                      options={PTService.CategoryDDLValues}
                      value={this.state.currentItem.category} containsTypeAhead={true} />
                  </div>
                  <div className="col2 spacing">{strings.PriorityLabel}</div>
                  <div className="col3"><HOODropDown
                    onChange={(event) => { this._updateDropDown(event, "priority") }}
                    options={PTService.PriorityDDLValues}
                    value={this.state.currentItem.priority} containsTypeAhead={true} /></div>
                </div>
              </div>
              <div className="label">{strings.ProgressLabel}</div>
              <div className="input">
                <div className="threeCol">
                  <div className="col1">
                    <HOODropDown
                      onChange={(event) => { this._updateDropDown(event, "progress") }}
                      options={PTService.ProgressDDLValues}
                      value={this.state.currentItem.progress} containsTypeAhead={true} />
                  </div>
                  <div className="col2"></div>
                  <div className="col3"></div>
                </div>
              </div>
            </div>

            <div className="label">{strings.NotesLabel}</div>
            <div className="input"><HOOText
              onChange={(event) => { this._updateField(event, "notes"); }}
              value={this.state.currentItem.notes}
              multiline={6} />
            </div>
            <div className="label"><HOOButton
              label={strings.Save}
              onClick={async (event) => { await this._save(event); }}
              type={1} /></div>
            <div className="input">
              <HOOButton
                label={strings.Cancel}
                onClick={(event) => { this._cancel(event); }}
                type={1} /></div>
            <div className="col3">
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