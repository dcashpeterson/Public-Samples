import * as React from 'react';
import { PeoplePicker } from '@microsoft/mgt-react';
import HOOText from '@n8d/htwoo-react/HOOText';
import HOOButton from '@n8d/htwoo-react/HOOButton';
import HOOLabel from '@n8d/htwoo-react/HOOLabel';
import HOODate from '@n8d/htwoo-react/HOODate';

import * as strings from 'FacilitiesRequestFormCustomizerStrings';
import { FacilitiesRequestItem, ReportStep, SaveType } from '../../../common/models/models';

export interface IStep3Props {
  editMode: boolean;
  currentItem: FacilitiesRequestItem;
  onChangeValue: (fieldName: string, value: string | number | boolean) => void;
  onChangeString: (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subField?: string, fieldType?: string) => void;
  onPeoplePickerChange: (fieldName: string, value: any) => void;
  onChangeDate: (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSave: (saveType: SaveType, action: string) => Promise<void>;
  onStepChange(step: ReportStep): void;
}

export interface IStep3State {
}

export class Step3State implements IStep3State {
  public constructor() { }
}

export default class Step3 extends React.PureComponent<IStep3Props, IStep3State> {
  private LOG_SOURCE = "🟢Step3";

  public constructor(props: IStep3Props) {
    super(props);
    this.state = new Step3State();
  }

  public render(): React.ReactElement<IStep3Props> {
    try {
      return (
        <>
          {(!this.props.editMode) &&
            <fieldset id="resolution" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.resolutionDescriptionLabel} />
                {this.props.currentItem.resolutionDescription}
              </div>

              <div className="hoo-field" role="group">
                <HOOLabel label={strings.resolutionDateLabel} />
                {this.props.currentItem.resolutionDate.toLocaleDateString()}
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.inspectionDateLabel} />
                {this.props.currentItem.inspectionDate.toLocaleDateString()}
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.requestStatusLabel} />
                {this.props.currentItem.requestStatus}
              </div>
              <div className="actions">
                <HOOButton
                  label={strings.editResolutionButton}
                  onClick={() => this.props.onStepChange(ReportStep.STEP3)}
                  type={2}
                />
              </div>
            </fieldset>
          }
          {(this.props.editMode) &&
            <fieldset id="resolution" className="hoo-fieldset no-outline" data-component={this.LOG_SOURCE}>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.resolutionDescriptionLabel} for='resolutionDescription' required={true} />
                <HOOText
                  forId='resolutionDescription'
                  multiline={5}
                  value={this.props.currentItem.resolutionDescription}
                  onChange={(event) => { this.props.onChangeString("resolutionDescription", event); }}
                />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.resolutionDateLabel} for='resolutionDate' required={true} />
                <HOODate
                  forId='resolutionDate'
                  value={this.props.currentItem.resolutionDate.toISOString().split('T')[0]}
                  onChange={(event) => { this.props.onChangeDate("resolutionDate", event); }} />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.resolvedByLabel} for='resolvedBy' required={true} />
                <PeoplePicker id='resolvedBy' type='person' aria-label='Resolved By' ariaLabel='Resolved By' showMax={4} selectionChanged={(e) => { this.props.onPeoplePickerChange('resolvedBy', e); }} selectedPeople={(this.props.currentItem.resolvedBy.displayName.length > 0) ? [{ displayName: this.props.currentItem.resolvedBy.displayName, mail: this.props.currentItem.resolvedBy.email, userPrincipalName: this.props.currentItem.resolvedBy.email }] : []} />
              </div>
              <div className="hoo-field" role="group">
                <HOOLabel label={strings.inspectionDateLabel} for='inspectionDate' />
                <HOODate
                  forId='inspectionDate'
                  value={this.props.currentItem.inspectionDate.toISOString().split('T')[0]}
                  onChange={(event) => { this.props.onChangeDate("inspectionDate", event); }} />
              </div>
              <div className="actions">
                <HOOButton
                  label={strings.unableToResolveButton}
                  onClick={() => this.props.onSave(SaveType.UPDATE, "Unable to Resolve")}
                  type={2}
                />
                <HOOButton
                  label={strings.completedButton}
                  onClick={() => this.props.onSave(SaveType.UPDATE, "Resolved")}
                  type={1}
                />
              </div>
            </fieldset>
          }
        </>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return (<div>There was an error rendering Step 3 {err}</div>);
    }
  }
}