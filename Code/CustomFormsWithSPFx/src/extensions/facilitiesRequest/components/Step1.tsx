import { PeoplePicker } from '@microsoft/mgt-react';
import HOOButton from '@n8d/htwoo-react/HOOButton';
import HOODate from '@n8d/htwoo-react/HOODate';
import HOOLabel from '@n8d/htwoo-react/HOOLabel';
import HOOText from '@n8d/htwoo-react/HOOText';
import * as React from 'react';

import HOODropDown from '@n8d/htwoo-react/HOODropDown';
import HOOOptionList from '@n8d/htwoo-react/HOOOptionList';
import * as strings from 'FacilitiesRequestFormCustomizerStrings';
import { FacilitiesRequestItem, FormView, IFacilitiesRequestItem, ReportStep, SaveType } from '../../../common/models/models';
import { formsService } from '../../../common/services/formsService';

export interface IStep1Props {
  editMode: boolean;
  currentItem: FacilitiesRequestItem;
  onChangeValue: (fieldName: string, value: string | number | boolean) => void;
  onChangeString: (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subField?: string, fieldType?: string) => void;
  onPeoplePickerChange: (fieldName: string, value: any) => void;
  onChangeDate: (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSave: (saveType: SaveType, action: string) => Promise<void>;
  onStepChange(step: ReportStep): void;
  validateForm: (currentItem: IFacilitiesRequestItem) => boolean;
}

export interface IStep1State {
  showThankYou: boolean;
}

export class Step1State implements IStep1State {
  public constructor(
    public showThankYou: boolean = false
  ) { }
}

export default class Step1 extends React.PureComponent<IStep1Props, IStep1State> {
  private LOG_SOURCE = "🟢Step1";
  private turnItOffAndOnAgain = require('../../../common/assets/turnitoff.gif');
  private severe = require('../../../common/assets/severe.gif');

  public constructor(props: IStep1Props) {
    super(props);
    this.state = new Step1State();
  }

  private _onSave(): void {
    if (this.props.validateForm(this.props.currentItem)) {
      this.setState({ showThankYou: true });
    }
  }

  public render(): React.ReactElement<IStep1Props> {
    try {
      return (
        <>
          {(!this.props.editMode) &&
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
              <div className="actions">
                <HOOButton
                  label={strings.editReportButton}
                  onClick={() => this.props.onStepChange(ReportStep.STEP1)}
                  type={2}
                />
              </div>
            </fieldset>
          }
          {((this.props.editMode) && (!this.state.showThankYou)) &&
            <fieldset id="new-item-form" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.issueTypeLabel} for='issueType' required={true} />
                <HOOOptionList
                  options={formsService.IssueTypeValues}
                  type={1}
                  forId='issueType'
                  value={this.props.currentItem.issueType}
                  onChange={(value) => { this.props.onChangeValue("issueType", value); }} />
              </div>
              <div className="hoo-field stretched" role="group">
                <HOOLabel label={strings.locationLabel} for='location' required={true} />
                <HOODropDown
                  forId='location'
                  onChange={(value) => { this.props.onChangeValue("location", value); }}
                  options={formsService.LocationFieldValues}
                  value={this.props.currentItem.location}
                  containsTypeAhead={true}
                />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.equipmentIdLabel} for='equipmentId' />
                <HOOText
                  forId='equipmentId'
                  value={this.props.currentItem.equipmentId}
                  onChange={(event) => { this.props.onChangeString("equipmentId", event); }}
                  inputElementAttributes={{ maxLength: 14, placeholder: 'e.g. ACME-1234-5678', autoComplete: 'off' }}
                />
                {strings.equipmentIdDescription}
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.severityLabel} for='severity' required={true} />
                <HOOOptionList
                  options={formsService.SeverityValues}
                  type={1}
                  forId='severity'
                  value={this.props.currentItem.severity}
                  onChange={(value) => { this.props.onChangeValue("severity", value); }} />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.issueDescriptionLabel} for='issueDescription' required={true} />
                {strings.issueDescriptionDescription}
                <HOOText
                  forId='issueDescription'
                  multiline={5}
                  value={this.props.currentItem.issueDescription}
                  onChange={(event) => { this.props.onChangeString("issueDescription", event); }}
                />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.reportedByLabel} for='reportedBy' required={true} />
                <PeoplePicker id='reportedBy' type='person' aria-label='Reported By' ariaLabel='Reported By' showMax={4} selectionChanged={(e) => this.props.onPeoplePickerChange('reportedBy', e)} selectedPeople={(this.props.currentItem.reportedBy.displayName.length > 0) ? [{ displayName: this.props.currentItem.reportedBy.displayName, mail: this.props.currentItem.reportedBy.email, userPrincipalName: this.props.currentItem.reportedBy.email }] : []} />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.reportedDateLabel} for='reportedDate' required={true} />
                <HOODate
                  forId='reportedDate'
                  value={this.props.currentItem.reportedDate.toISOString().split('T')[0]}
                  onChange={(event) => { this.props.onChangeDate("reportedDate", event); }} />
              </div>
              {(formsService.formView === FormView.NEW) &&
                <div className="actions">
                  <HOOButton
                    label={strings.cancelButton}
                    onClick={this.props.onClose}
                    type={2}
                  />
                  <HOOButton
                    label={strings.reportIssueButton}
                    onClick={() => this._onSave()}
                    type={1}
                  />
                </div>
              }
              {(formsService.formView !== FormView.NEW) &&
                <div className="actions">
                  <HOOButton
                    label={strings.updateReportButton}
                    onClick={() => this.props.onSave(SaveType.UPDATE, "")}
                    type={1}
                  />
                </div>
              }

            </fieldset>
          }

          {((this.props.editMode) && (this.state.showThankYou)) &&
            <fieldset id="new-item-form" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
              <div><img src={(this.props.currentItem.severity === "Urgent") ? this.severe : this.turnItOffAndOnAgain} alt='Have you tried turing it on and back on?' /></div>
              <div className="actions">
                <HOOButton
                  label={strings.cancelButton}
                  onClick={this.props.onClose}
                  type={2}
                />
                <HOOButton
                  label={strings.reportIssueButton}
                  onClick={() => this.props.onSave(SaveType.NEW, "Reported")}
                  type={1}
                />
              </div>
            </fieldset>
          }
        </>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div>There was an error rendering Step 1 {err}</div>);
    }
  }
}