import * as React from 'react';
import { PeoplePicker } from '@microsoft/mgt-react';
import HOOText from '@n8d/htwoo-react/HOOText';
import HOOButton from '@n8d/htwoo-react/HOOButton';
import HOOLabel from '@n8d/htwoo-react/HOOLabel';
import HOODate from '@n8d/htwoo-react/HOODate';

import * as strings from 'FacilitiesRequestFormCustomizerStrings';
import { FacilitiesRequestItem, SaveType } from '../../../common/models/models';

export interface IStep2Props {
  editMode: boolean;
  currentItem: FacilitiesRequestItem;
  onChangeValue: (fieldName: string, value: string | number | boolean) => void;
  onChangeString: (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subField?: string, fieldType?: string) => void;
  onPeoplePickerChange: (fieldName: string, value: any) => void;
  onChangeDate: (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSave: (saveType: SaveType, action: string) => Promise<void>;
}

export interface IStep2State {
}

export class Step2State implements IStep2State {
  public constructor() { }
}

export default class Step2 extends React.PureComponent<IStep2Props, IStep2State> {
  private LOG_SOURCE = "🟢Step2";

  public constructor(props: IStep2Props) {
    super(props);
    this.state = new Step2State();
  }

  public render(): React.ReactElement<IStep2Props> {
    try {
      return (
        <>
          {(!this.props.editMode) &&
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
          }
          {(this.props.editMode) &&
            <fieldset id="issue-verification" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.verificationDateLabel} for='verificationDate' />
                <HOODate
                  forId='verificationDate'
                  value={this.props.currentItem.verificationDate.toISOString().split('T')[0]}
                  onChange={(event) => { this.props.onChangeDate("verificationDate", event); }} />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.additionalCommentsLabel} for='additionalComments' />
                <HOOText
                  forId='additionalComments'
                  multiline={5}
                  value={this.props.currentItem.additionalComments}
                  onChange={(event) => { this.props.onChangeString("additionalComments", event); }}
                />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.assigneeLabel} for='assignee' />
                <PeoplePicker id='assignee' type='person' aria-label='Assignee' ariaLabel='Assignee' showMax={4} selectionChanged={(e) => { this.props.onPeoplePickerChange('assignee', e); }} selectedPeople={(this.props.currentItem.assignee.displayName.length > 0) ? [{ displayName: this.props.currentItem.assignee.displayName, mail: this.props.currentItem.assignee.email, userPrincipalName: this.props.currentItem.assignee.email }] : []} />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.estimatedResolutionDateLabel} for='estimatedResolutionDate' />
                <HOODate
                  forId='estimatedResolutionDate'
                  value={this.props.currentItem.estimatedResolutionDate.toISOString().split('T')[0]}
                  onChange={(event) => { this.props.onChangeDate("estimatedResolutionDate", event); }} />
              </div>
              <div className="actions">
                <HOOButton
                  label={strings.invalidateReportButton}
                  onClick={() => this.props.onSave(SaveType.UPDATE, "Closed")}
                  type={2}
                />
                <HOOButton
                  label={strings.validateReportButton}
                  onClick={() => this.props.onSave(SaveType.UPDATE, "Verified")}
                  type={1}
                />
              </div>
            </fieldset>
          }
        </>

      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div>There was an error rendering Step 2 {err}</div>);
    }
  }
}