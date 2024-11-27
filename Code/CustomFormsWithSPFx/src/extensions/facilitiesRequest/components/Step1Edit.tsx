import * as React from 'react';
import { PeoplePicker } from '@microsoft/mgt-react';
import HOOText from '@n8d/htwoo-react/HOOText';
import HOOButton from '@n8d/htwoo-react/HOOButton';
import HOOLabel from '@n8d/htwoo-react/HOOLabel';
import HOODate from '@n8d/htwoo-react/HOODate';

import * as strings from 'FacilitiesRequestFormCustomizerStrings';
import { formsService } from '../../../common/services/formsService';
import { FacilitiesRequestItem, SaveType } from '../../../common/models/models';
import HOOOptionList from '@n8d/htwoo-react/HOOOptionList';
import HOODropDown from '@n8d/htwoo-react/HOODropDown';

export interface IStep1EditProps {
  currentItem: FacilitiesRequestItem;
  onChangeValue: (fieldName: string, value: string | number | boolean) => void;
  onChangeString: (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subField?: string, fieldType?: string) => void;
  onPeoplePickerChange: (fieldName: string, value: any) => void;
  onChangeDate: (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSave: (saveType: SaveType, action: string) => Promise<void>;
}

export interface IStep1EditState {
  currentItem: FacilitiesRequestItem;
}

export class Step1EditState implements IStep1EditState {
  public constructor(
    public currentItem: FacilitiesRequestItem = new FacilitiesRequestItem(),
  ) { }
}

export default class Step1Edit extends React.PureComponent<IStep1EditProps, IStep1EditState> {
  private LOG_SOURCE = "🟢Step1Edit";

  public constructor(props: IStep1EditProps) {
    super(props);
    this.state = new Step1EditState();
  }

  public render(): React.ReactElement<IStep1EditProps> {
    try {
      return (
        <fieldset id="new-item-form" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.issueTypeLabel} for='issueType' required={true} />
            <HOOOptionList
              options={formsService.IssueTypeValues}
              type={1}
              forId='issueType'
              value={this.state.currentItem.issueType}
              onChange={(value) => { this.props.onChangeValue("issueType", value); }} />
          </div>
          <div className="hoo-field stretched" role="group">
            <HOOLabel label={strings.locationLabel} for='location' required={true} />
            <HOODropDown
              forId='location'
              onChange={(value) => { this.props.onChangeValue("location", value); }}
              options={formsService.LocationFieldValues}
              value={this.state.currentItem.location}
            />
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.equipmentIdLabel} for='equipmentId' />
            <HOOText
              forId='equipmentId'
              value={this.state.currentItem.equipmentId}
              onChange={(event) => { this.props.onChangeString("equipmentId", event); }}
            />
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.severityLabel} for='severity' required={true} />
            <HOOOptionList
              options={formsService.SeverityValues}
              type={1}
              forId='severity'
              value={this.state.currentItem.severity}
              onChange={(value) => { this.props.onChangeValue("severity", value); }} />
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.issueDescriptionLabel} for='issueDescription' required={true} />
            <HOOText
              forId='issueDescription'
              multiline={5}
              value={this.state.currentItem.issueDescription}
              onChange={(event) => { this.props.onChangeString("issueDescription", event); }}
            />
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.reportedDateLabel} for='reportedBy' required={true} />
            <PeoplePicker id='reportedBy' type='person' aria-label='Reported By' ariaLabel='Reported By' showMax={4} onBlur={(e) => { this.props.onPeoplePickerChange('reportedBy', e); }} selectedPeople={(this.state.currentItem.reportedBy.displayName.length > 0) ? [{ displayName: this.state.currentItem.reportedBy.displayName, mail: this.state.currentItem.reportedBy.email, userPrincipalName: this.state.currentItem.reportedBy.email }] : []} />
          </div>
          <div className="hoo-field" role="group">
            <HOOLabel label={strings.reportedDateLabel} for='reportedDate' required={true} />
            <HOODate
              forId='reportedDate'
              value={this.state.currentItem.reportedDate.toISOString().split('T')[0]}
              onChange={(event) => { this.props.onChangeDate("reportedDate", event); }} />
          </div>
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
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div></div>);
    }
  }
}