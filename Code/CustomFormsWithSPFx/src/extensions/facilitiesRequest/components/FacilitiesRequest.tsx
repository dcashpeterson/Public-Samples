import * as React from 'react';
import { Log } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import { IUser } from '@microsoft/mgt-react';
import { cloneDeep, isEqual } from '@microsoft/sp-lodash-subset';
import { HOOPresenceStatus } from '@n8d/htwoo-react/HOOAvatarPres';

import * as strings from 'FacilitiesRequestFormCustomizerStrings';
import { formsService } from '../../../common/services/formsService';
import styles from './FacilitiesRequest.module.scss';
import { FacilitiesRequestItem, IFacilitiesRequestItem, ReportStep, SaveType, UserField } from '../../../common/models/models';
import HOOAccordion from '@n8d/htwoo-react/HOOAccordion';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import ProgressBar from './ProgressBar';
import HOOButton from '@n8d/htwoo-react/HOOButton';

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
      this._onPeoplePickerChange = this._onPeoplePickerChange.bind(this);
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

  private _formValid = (currentItem: IFacilitiesRequestItem): boolean => {
    let retVal = false;
    const errors: string[] = [];
    try {
      //By checking to see what step the form is in we can conditionally have required fields
      if (currentItem.reportStep === ReportStep.STEP1) {
        if (currentItem.issueType === "") {
          errors.push("Issue Type is a require field.");
        }
        if (currentItem.location === "") {
          errors.push("Location is a require field.");
        }
        if (currentItem.severity === "") {
          errors.push("Severity is a require field.");
        }
        if (currentItem.issueDescription === "" || currentItem.issueDescription?.length < 1) {
          errors.push("Issue Description is a require field.");
        }
        if (currentItem.reportedBy === null || currentItem.reportedBy?.displayName.length < 1) {
          errors.push("Reported By is a require field. Please select a valid user.");
        }
        if (currentItem.reportedDate === null) {
          errors.push("Reported Date is a require field.");
        }
      }
      if (currentItem.reportStep === ReportStep.STEP2) {
        if (currentItem.verificationDate === null) {
          errors.push("Verification Date is a require field.");
        }
        if (currentItem.assignee === null || currentItem.assignee?.displayName.length < 1) {
          errors.push("Assigned To is a require field. Please select a valid user.");
        }
      }
      if (currentItem.reportStep === ReportStep.STEP3) {
        if (currentItem.resolutionDescription === null || currentItem.resolutionDescription?.length < 1) {
          errors.push("Resolution Description is a require field.");
        }
        if (currentItem.resolutionDate === null) {
          errors.push("Verification Date is a require field. Please select a valid resolution date.");
        }
        if (currentItem.resolvedBy === null || currentItem.resolvedBy?.displayName.length < 1) {
          errors.push("Resolved By is a require field. Please select a valid user.");
        }
      }
      this.setState({ error: errors });
      if (errors.length === 0) {
        retVal = true;
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
      if (user) {
        if (user.displayName !== currentItem[fieldName].displayName) {
          currentItem[fieldName] = { displayName: user.displayName, email: user.userPrincipalName, loginName: user.userPrincipalName, id: 0, photoUrl: "", presence: HOOPresenceStatus.Invisible };
          this.setState({ currentItem });
        }
      } else {
        currentItem[fieldName] = new UserField();
        this.setState({ currentItem });
      }
    } catch (err) {
      console.error(LOG_SOURCE, "(_onPeoplePickerChange)", err);
    }
  }
  private _onChangeString = (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subField?: string, fieldType?: string): void => {
    try {
      const value = event.target.value;
      const currentItem: any = cloneDeep(this.state.currentItem);
      if (subField) {
        currentItem[fieldName][subField] = value;
      } else {
        currentItem[fieldName] = value;
      }
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
      this.setState({ currentItem });
    } catch (err) {
      console.error(`${LOG_SOURCE} (_onChangeValue) - ${err}`);
    }
  }

  private _getProgress = (reportStep: ReportStep): number => {
    let retVal: number = 0;
    try {
      if (reportStep === ReportStep.STEP1) {
        retVal = 25;
      } else if (reportStep === ReportStep.STEP2) {
        retVal = 50;
      } else if (reportStep === ReportStep.STEP3) {
        retVal = 75;
      } else if (reportStep === ReportStep.STEP4) {
        retVal = 100;
      }
    } catch (err) {
      console.error(`${LOG_SOURCE} (_getProgress) - ${err}`);
    }
    return retVal;
  }

  private _changeStep = (step: ReportStep): void => {
    try {
      const currentItem: FacilitiesRequestItem = cloneDeep(this.state.currentItem);
      currentItem.reportStep = step;
      this.setState({ currentItem });
    } catch (err) {
      console.error(`${LOG_SOURCE} (_changeStep) - ${err}`);
    }
  }

  private _onSave = async (saveType: SaveType, action: string): Promise<void> => {
    try {
      const currentItem: FacilitiesRequestItem = cloneDeep(this.state.currentItem);
      const valid = this._formValid(currentItem);
      if (valid) {
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

  private _renderForm(): React.ReactElement<IFacilitiesRequestProps> {
    try {
      const step1: React.DetailedHTMLProps<React.AllHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement> = {
        open: (this.state.currentItem.reportStep === ReportStep.STEP2) ? true : false,
        name: "issue-tracking",
      };
      const step2: React.DetailedHTMLProps<React.AllHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement> = {
        open: (this.state.currentItem.reportStep !== ReportStep.STEP2) ? true : false,
        name: "issue-tracking",
      };
      return (<>
        <HOOButton iconName='hoo-icon-close' onClick={this._onClose} type={0} />

        <ProgressBar progress={this._getProgress(this.state.currentItem.reportStep)} />
        <section className="facility-form">
          {(this.state.currentItem.reportStep === ReportStep.STEP1) &&
            <Step1
              currentItem={this.state.currentItem}
              onChangeValue={this._onChangeValue}
              onChangeString={this._onChangeString}
              onPeoplePickerChange={this._onPeoplePickerChange}
              onChangeDate={this._onChangeDate}
              onClose={this._onClose}
              onSave={this._onSave}
              editMode={true}
              onStepChange={this._changeStep}
              validateForm={this._formValid}
            />
          }
          {(this.state.currentItem.reportStep === ReportStep.STEP2) &&
            <>
              <HOOAccordion
                header={strings.reportedIssueHeader}
                iconName="hoo-icon-arrow-right"
                rootElementAttributes={step1}>
                <div>
                  <Step1
                    currentItem={this.state.currentItem}
                    onChangeValue={this._onChangeValue}
                    onChangeString={this._onChangeString}
                    onPeoplePickerChange={this._onPeoplePickerChange}
                    onChangeDate={this._onChangeDate}
                    onClose={this._onClose}
                    onSave={this._onSave}
                    editMode={false}
                    onStepChange={this._changeStep}
                    validateForm={this._formValid} />
                </div>
              </HOOAccordion>
              <section className="review">
                <h2>{strings.reviewAssignHeader}</h2>
                <div>Please review and validate the request. Once validated please assign the task and provide and estimated resolution date.</div>
                <Step2
                  currentItem={this.state.currentItem}
                  onChangeValue={this._onChangeValue}
                  onChangeString={this._onChangeString}
                  onPeoplePickerChange={this._onPeoplePickerChange}
                  onChangeDate={this._onChangeDate}
                  onClose={this._onClose}
                  onSave={this._onSave}
                  editMode={true}
                  onStepChange={this._changeStep} />
              </section>
            </>
          }
          {(this.state.currentItem.reportStep === ReportStep.STEP3) &&
            <>
              <section>
                <HOOAccordion
                  header={strings.reportedIssueHeader}
                  iconName="hoo-icon-arrow-right"
                  rootElementAttributes={step1}>
                  <div>
                    <Step1
                      currentItem={this.state.currentItem}
                      onChangeValue={this._onChangeValue}
                      onChangeString={this._onChangeString}
                      onPeoplePickerChange={this._onPeoplePickerChange}
                      onChangeDate={this._onChangeDate}
                      onClose={this._onClose}
                      onSave={this._onSave}
                      editMode={false}
                      onStepChange={this._changeStep}
                      validateForm={this._formValid} />
                  </div>
                </HOOAccordion>
                <HOOAccordion
                  header={strings.reviewAssignHeader}
                  iconName="hoo-icon-arrow-right"
                  rootElementAttributes={step2}>
                  <div>
                    <Step2
                      currentItem={this.state.currentItem}
                      onChangeValue={this._onChangeValue}
                      onChangeString={this._onChangeString}
                      onPeoplePickerChange={this._onPeoplePickerChange}
                      onChangeDate={this._onChangeDate}
                      onClose={this._onClose}
                      onSave={this._onSave}
                      editMode={false}
                      onStepChange={this._changeStep} />
                  </div>
                </HOOAccordion>
              </section>
              <section className="review">
                <h2>{strings.issueResolutionHeader}</h2>
                <div>Please provide a description of the resolution and a next inspection date if necessary.</div>
                <Step3
                  currentItem={this.state.currentItem}
                  onChangeValue={this._onChangeValue}
                  onChangeString={this._onChangeString}
                  onPeoplePickerChange={this._onPeoplePickerChange}
                  onChangeDate={this._onChangeDate}
                  onClose={this._onClose}
                  onSave={this._onSave}
                  editMode={true}
                  onStepChange={this._changeStep} />
              </section>
            </>
          }
          {(this.state.currentItem.reportStep === ReportStep.STEP4) &&
            <>
              <section>
                <HOOAccordion
                  header={strings.reportedIssueHeader}
                  iconName="hoo-icon-arrow-right"
                  rootElementAttributes={step1}>
                  <div>
                    <Step1
                      currentItem={this.state.currentItem}
                      onChangeValue={this._onChangeValue}
                      onChangeString={this._onChangeString}
                      onPeoplePickerChange={this._onPeoplePickerChange}
                      onChangeDate={this._onChangeDate}
                      onClose={this._onClose}
                      onSave={this._onSave}
                      editMode={false}
                      onStepChange={this._changeStep}
                      validateForm={this._formValid} />
                  </div>
                </HOOAccordion>
                <HOOAccordion
                  header={strings.reviewAssignHeader}
                  iconName="hoo-icon-arrow-right"
                  rootElementAttributes={step2}>
                  <div>
                    <Step2
                      currentItem={this.state.currentItem}
                      onChangeValue={this._onChangeValue}
                      onChangeString={this._onChangeString}
                      onPeoplePickerChange={this._onPeoplePickerChange}
                      onChangeDate={this._onChangeDate}
                      onClose={this._onClose}
                      onSave={this._onSave}
                      editMode={false}
                      onStepChange={this._changeStep} />
                  </div>
                </HOOAccordion>
              </section>
              <section className="review">
                <h2>{strings.issueResolutionHeader}</h2>
                <Step3
                  currentItem={this.state.currentItem}
                  onChangeValue={this._onChangeValue}
                  onChangeString={this._onChangeString}
                  onPeoplePickerChange={this._onPeoplePickerChange}
                  onChangeDate={this._onChangeDate}
                  onClose={this._onClose}
                  onSave={this._onSave}
                  editMode={false}
                  onStepChange={this._changeStep} />
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
    return <div className={styles.facilitiesRequest} data-component={LOG_SOURCE}>
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
      {this._renderForm()}
    </div>;
  }
}
