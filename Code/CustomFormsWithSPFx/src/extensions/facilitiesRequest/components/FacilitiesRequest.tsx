import * as React from 'react';
import { Log } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import { IUser, PeoplePicker } from '@microsoft/mgt-react';
import { cloneDeep, isEqual } from '@microsoft/sp-lodash-subset';
import HOOText from '@n8d/htwoo-react/HOOText';
import HOOButton from '@n8d/htwoo-react/HOOButton';
import HOOLabel from '@n8d/htwoo-react/HOOLabel';
import { HOOPresenceStatus } from '@n8d/htwoo-react/HOOAvatarPres';
import HOODate from '@n8d/htwoo-react/HOODate';

import * as strings from 'FacilitiesRequestFormCustomizerStrings';
import { formsService } from '../../../common/services/formsService';
import styles from './FacilitiesRequest.module.scss';
import { FacilitiesRequestItem, FormView, IFacilitiesRequestItem, SaveType, UserField } from '../../../common/models/models';
import HOOAccordion from '@n8d/htwoo-react/HOOAccordion';
import Step1View from './Step1View';
import Step2View from './Step2View';
import Step3View from './Step3View';
import Step1Edit from './Step1Edit';

export interface IFacilitiesRequestProps {
  context: FormCustomizerContext;
  currentItem: FacilitiesRequestItem;
  onSave: (currentItem: FacilitiesRequestItem) => void;
  onClose: () => void;
}

export interface IFacilitiesRequestState {
  currentItem: IFacilitiesRequestItem;
  formStep: string;
  error: string[];
}

export class FacilitiesRequestState implements IFacilitiesRequestState {
  constructor(
    public currentItem: IFacilitiesRequestItem = new FacilitiesRequestItem(),
    public formStep: string = "New Request",
    public error: string[] = []
  ) { }
}

const LOG_SOURCE: string = '🏳️‍🌈 FacilitiesRequest';


export default class FacilitiesRequest extends React.Component<IFacilitiesRequestProps, IFacilitiesRequestState> {

  public constructor(props: IFacilitiesRequestProps) {
    super(props);
    try {
      const listItem: IFacilitiesRequestItem = (props.currentItem) ? cloneDeep(props.currentItem) : new FacilitiesRequestItem();

      if (listItem.reportedBy.displayName.length <= 0) {
        listItem.reportedBy = { displayName: props.context.pageContext.user.displayName, email: props.context.pageContext.user.email, loginName: props.context.pageContext.user.email, id: 0, photoUrl: "", presence: HOOPresenceStatus.Invisible };
      }

      this.state = new FacilitiesRequestState(listItem, "Reported", []);
    } catch (err) {
      console.error(`${LOG_SOURCE} (constructor) - ${err}`);
    }
  }

  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: FacilitiesRequest mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: FacilitiesRequest unmounted');
  }

  public shouldComponentUpdate(nextProps: Readonly<IFacilitiesRequestProps>, nextState: Readonly<IFacilitiesRequestState>): boolean {
    try {
      if ((isEqual(nextState, this.state) && isEqual(nextProps, this.props)))
        return false;
    } catch (err) {
      console.error(`${LOG_SOURCE} (shouldComponentUpdate) - ${err}`);
    }
    return true;
  }

  private _formValid = (currentItem: IFacilitiesRequestItem): string[] => {
    const retVal: string[] = [];
    try {
      if (currentItem.reportedBy === null || currentItem.reportedBy?.displayName.length < 1) {
        retVal.push("Reported by is a require field.");
      }
      if (currentItem.issueDescription === null || currentItem.issueDescription?.length < 1) {
        retVal.push("Issue Description is a require field.");
      }
    } catch (err) {
      console.error(`${LOG_SOURCE} (_formValid) - ${err}`);
    }
    return retVal;
  }

  private _onPeoplePickerChange(fieldName: string, value: any): void {
    try {
      const currentItem: any = cloneDeep(this.state.currentItem);
      const user: IUser = value.detail[0] as IUser;
      //This event was firing twice, so I had to add this check to make sure it only fires when it has changed.
      if (user.displayName !== currentItem[fieldName].displayName) {
        if (user) {
          currentItem[fieldName] = { displayName: user.displayName, email: user.userPrincipalName, loginName: user.userPrincipalName, id: 0, photoUrl: "", presence: HOOPresenceStatus.Invisible };
        } else {
          currentItem[fieldName] = new UserField();
        }

        this.setState({ currentItem });
      }
    } catch (err) {
      console.error(LOG_SOURCE, "(_onPeoplePickerChange)", err);
    }
  }
  private _onChangeString = (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subField?: string, fieldType?: string): void => {
    try {
      let value = event.target.value;
      if (fieldType === "Date") {
        value = new Date(value).toISOString();
      }
      const currentItem: any = cloneDeep(this.state.currentItem);
      if (subField) {
        currentItem[fieldName][subField] = value;
      } else {
        currentItem[fieldName] = value;
      }

      //const error = this._formValid(currentItem);
      this.setState({ currentItem });
    } catch (err) {
      console.error(LOG_SOURCE, "(_onChangeString)", err);
    }
  }

  private _onChangeDate = (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    try {
      const value = new Date(event.target.value);
      const currentItem: any = cloneDeep(this.state.currentItem);
      currentItem[fieldName] = value;
      this.setState({ currentItem });
    } catch (err) {
      console.error(LOG_SOURCE, "(_onChangeString)", err);
    }
  }

  private _onChangeValue = (fieldName: string, value: string | number | boolean): void => {
    try {
      const currentItem: any = cloneDeep(this.state.currentItem);
      currentItem[fieldName] = value;
      //const error = this._formValid(currentItem);
      this.setState({ currentItem });
    } catch (err) {
      console.error(`${LOG_SOURCE} (_onChangeValue) - ${err}`);
    }
  }

  private _onSave = async (saveType: SaveType, action: string): Promise<void> => {
    try {
      const currentItem: FacilitiesRequestItem = cloneDeep(this.state.currentItem);
      const valid = this._formValid(currentItem);
      if (valid.length <= 0) {
        switch (action) {
          case "Reported":
            currentItem.requestStatus = strings.statusValues[1];
            break;
          case "Verified":
            currentItem.requestStatus = strings.statusValues[2];
            break;
          case "Resolved":
            currentItem.requestStatus = strings.statusValues[3];
            break;
          case "Unable to Resolve":
            currentItem.requestStatus = strings.statusValues[5];
            break;
          case "Closed":
            currentItem.requestStatus = strings.statusValues[4];
            break;
          default:
            break;
        }
        const result: boolean = await formsService.SaveItem(currentItem, saveType);
        if (result) {
          this.setState({ currentItem: currentItem, error: [] });
          this.props.onSave(currentItem);
        }
      } else {
        this.setState({ error: valid });
      }

    } catch (err) {
      console.error(`${LOG_SOURCE} (_onSave) - ${err}`);
    }
  }

  private _onClose = (): void => {
    try {
      const currentItem: FacilitiesRequestItem = new FacilitiesRequestItem();
      this.setState({ currentItem });
      this.props.onClose();
    } catch (err) {
      console.error(`${LOG_SOURCE} (_onClose) - ${err}`);
    }
  }

  private _renderEdit(): React.ReactElement<IFacilitiesRequestProps> {
    try {
      const step1: React.DetailedHTMLProps<React.AllHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement> = {
        open: (this.state.currentItem.requestStatus !== strings.statusValues[2]) ? true : false,
        name: "issue-tracking",
      };
      const step2: React.DetailedHTMLProps<React.AllHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement> = {
        open: (this.state.currentItem.requestStatus === strings.statusValues[2]) ? true : false,
        name: "issue-tracking",
      };
      return (<>
        <section className="facility-form">
          {(this.state.currentItem.requestStatus === strings.statusValues[0] && formsService.formView === FormView.NEW) &&
            <Step1Edit
              currentItem={this.state.currentItem}
              onChangeValue={this._onChangeValue}
              onChangeString={this._onChangeString}
              onPeoplePickerChange={this._onPeoplePickerChange}
              onChangeDate={this._onChangeDate}
              onClose={this._onClose}
              onSave={this._onSave} />
          }
          {(this.state.currentItem.requestStatus === strings.statusValues[1] && formsService.formView === FormView.EDIT) &&
            <>
              <HOOAccordion
                header={strings.reportedIssueHeader}
                iconName="hoo-icon-arrow-right"
                rootElementAttributes={step1}>
                <div>
                  <Step1View currentItem={this.state.currentItem} />
                </div>
              </HOOAccordion>
              <section className="review">
                <h2>{strings.reviewAssignHeader}</h2>
                <div>Please review and validate the request. Once validated please assign the task and provide and estimated resolution date.</div>
                <fieldset id="issue-verification" className="hoo-fieldset no-outline">
                  <div className="hoo-field" role="group">
                    <HOOLabel label={strings.verificationDateLabel} for='verificationDate' />
                    <HOODate
                      forId='verificationDate'
                      value={this.state.currentItem.verificationDate.toISOString().split('T')[0]}
                      onChange={(event) => { this._onChangeDate("verificationDate", event); }} />
                  </div>
                  <div className="hoo-field" role="group">
                    <HOOLabel label={strings.additionalCommentsLabel} for='additionalComments' />
                    <HOOText
                      forId='additionalComments'
                      multiline={5}
                      value={this.state.currentItem.additionalComments}
                      onChange={(event) => { this._onChangeString("additionalComments", event); }}
                    />
                  </div>
                  <div className="hoo-field" role="group">
                    <HOOLabel label={strings.assigneeLabel} for='assignee' />
                    <PeoplePicker id='assignee' type='person' aria-label='Assignee' ariaLabel='Assignee' showMax={4} selectionChanged={(e) => { this._onPeoplePickerChange('assignee', e); }} selectedPeople={(this.state.currentItem.assignee.displayName.length > 0) ? [{ displayName: this.state.currentItem.assignee.displayName, mail: this.state.currentItem.assignee.email, userPrincipalName: this.state.currentItem.assignee.email }] : []} />
                  </div>
                  <div className="hoo-field" role="group">
                    <HOOLabel label={strings.estimatedResolutionDateLabel} for='estimatedResolutionDate' />
                    <HOODate
                      forId='estimatedResolutionDate'
                      value={this.state.currentItem.estimatedResolutionDate.toISOString().split('T')[0]}
                      onChange={(event) => { this._onChangeDate("estimatedResolutionDate", event); }} />
                  </div>
                  <div className="actions">
                    <HOOButton
                      label={strings.invalidateReportButton}
                      onClick={() => this._onSave(SaveType.UPDATE, "Closed")}
                      type={2}
                    />
                    <HOOButton
                      label={strings.validateReportButton}
                      onClick={() => this._onSave(SaveType.UPDATE, "Verified")}
                      type={1}
                    />
                  </div>
                </fieldset>
              </section>
            </>
          }
          {(this.state.currentItem.requestStatus === strings.statusValues[2] && formsService.formView === FormView.EDIT) &&
            <>
              <section>
                <HOOAccordion
                  header={strings.reportedIssueHeader}
                  iconName="hoo-icon-arrow-right"
                  rootElementAttributes={step1}>
                  <div>
                    <Step1View currentItem={this.state.currentItem} />
                  </div>
                </HOOAccordion>
                <HOOAccordion
                  header={strings.reviewAssignHeader}
                  iconName="hoo-icon-arrow-right"
                  rootElementAttributes={step2}>
                  <div>
                    <Step2View currentItem={this.state.currentItem} />
                  </div>
                </HOOAccordion>
              </section>
              <section className="review">
                <h2>{strings.issueResolutionHeader}</h2>
                <div>Please provide a description of the resolution and a next inspection date if necessary.</div>
                <fieldset id="resolution" className="hoo-fieldset no-outline">
                  <div className="hoo-field" role="group">
                    <HOOLabel label={strings.resolutionDescriptionLabel} for='resolutionDescription' />
                    <HOOText
                      forId='resolutionDescription'
                      multiline={5}
                      value={this.state.currentItem.resolutionDescription}
                      onChange={(event) => { this._onChangeString("resolutionDescription", event); }}
                    />
                  </div>
                  <div className="hoo-field" role="group">
                    <HOOLabel label={strings.resolutionDateLabel} for='resolutionDate' />
                    <HOODate
                      forId='resolutionDate'
                      value={this.state.currentItem.resolutionDate.toISOString().split('T')[0]}
                      onChange={(event) => { this._onChangeDate("resolutionDate", event); }} />
                  </div>
                  <div className="hoo-field" role="group">
                    <HOOLabel label={strings.resolvedByLabel} for='resolvedBy' />
                    <PeoplePicker id='resolvedBy' type='person' aria-label='Resolved By' ariaLabel='Resolved By' showMax={4} selectionChanged={(e) => { this._onPeoplePickerChange('resolvedBy', e); }} selectedPeople={(this.state.currentItem.resolvedBy.displayName.length > 0) ? [{ displayName: this.state.currentItem.resolvedBy.displayName, mail: this.state.currentItem.resolvedBy.email, userPrincipalName: this.state.currentItem.resolvedBy.email }] : []} />
                  </div>
                  <div className="hoo-field" role="group">
                    <HOOLabel label={strings.inspectionDateLabel} for='inspectionDate' />
                    <HOODate
                      forId='inspectionDate'
                      value={this.state.currentItem.inspectionDate.toISOString().split('T')[0]}
                      onChange={(event) => { this._onChangeDate("inspectionDate", event); }} />
                  </div>
                  <div className="actions">
                    <HOOButton
                      label={strings.unableToResolveButton}
                      onClick={() => this._onSave(SaveType.UPDATE, "Unable to Resolve")}
                      type={2}
                    />
                    <HOOButton
                      label={strings.completedButton}
                      onClick={() => this._onSave(SaveType.UPDATE, "Resolved")}
                      type={1}
                    />
                  </div>
                </fieldset>
              </section>
            </>
          }
          {((this.state.currentItem.requestStatus === strings.statusValues[3] || this.state.currentItem.requestStatus === strings.statusValues[4] || this.state.currentItem.requestStatus === strings.statusValues[5]) && formsService.formView !== FormView.NEW) &&
            <>
              <section>
                <HOOAccordion
                  header={strings.reportedIssueHeader}
                  iconName="hoo-icon-arrow-right"
                  rootElementAttributes={step1}>
                  <div>
                    <Step1View currentItem={this.state.currentItem} />
                  </div>
                </HOOAccordion>
                <HOOAccordion
                  header={strings.reviewAssignHeader}
                  iconName="hoo-icon-arrow-right"
                  rootElementAttributes={step2}>
                  <div>
                    <Step2View currentItem={this.state.currentItem} />
                  </div>
                </HOOAccordion>
              </section>
              <section className="review">
                <h2>{strings.issueResolutionHeader}</h2>
                <Step3View currentItem={this.state.currentItem} />
              </section>
            </>
          }
        </section>
      </>)
    } catch (err) {
      console.error(`${LOG_SOURCE} (_renderNew) - ${err}`);
      return <div>Error occurred while rendering the edit form. {err}</div>;
    }
  }

  public render(): React.ReactElement<IFacilitiesRequestProps> {
    return <div className={styles.facilitiesRequest} >{formsService.formView}{strings.statusValues[1]}
      <div>Put control here to show where item is in process</div>
      {this.state.error.length > 0 && (
        <>
          <h2>{strings.errorHeader}</h2>
          <ul>
            {this.state.error.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </>
      )}
      {this._renderEdit()}
      {/* {formsService.formView !== FormView.VIEW &&
       
      }else{
        this._renderView()
      } */}





    </div>;
  }
}
