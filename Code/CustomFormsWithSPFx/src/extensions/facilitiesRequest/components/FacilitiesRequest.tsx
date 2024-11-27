import * as React from 'react';
import { Log } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import { IUser } from '@microsoft/mgt-react';
import { cloneDeep, isEqual } from '@microsoft/sp-lodash-subset';
import { HOOPresenceStatus } from '@n8d/htwoo-react/HOOAvatarPres';

import * as strings from 'FacilitiesRequestFormCustomizerStrings';
import { formsService } from '../../../common/services/formsService';
import styles from './FacilitiesRequest.module.scss';
import { FacilitiesRequestItem, FormView, IFacilitiesRequestItem, SaveType, UserField } from '../../../common/models/models';
import HOOAccordion from '@n8d/htwoo-react/HOOAccordion';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import ProgressBar from './ProgressBar';

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

  private _getProgress = (status: string): number => {
    let retVal: number = 0;
    try {
      if (status === strings.statusValues[0]) {
        retVal = 25;
      } else if (status === strings.statusValues[1]) {
        retVal = 50;
      } else if (status === strings.statusValues[2]) {
        retVal = 75;
      } else if ((status === strings.statusValues[3]) || status === strings.statusValues[4]) {
        retVal = 100;
      }
    } catch (err) {
      console.error(`${LOG_SOURCE} (_getProgress) - ${err}`);
    }
    return retVal;
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

  private _renderForm(): React.ReactElement<IFacilitiesRequestProps> {
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
        <ProgressBar progress={this._getProgress(this.state.currentItem.requestStatus)} />
        <section className="facility-form">
          {(this.state.currentItem.requestStatus === strings.statusValues[0] && formsService.formView === FormView.NEW) &&
            <Step1
              currentItem={this.state.currentItem}
              onChangeValue={this._onChangeValue}
              onChangeString={this._onChangeString}
              onPeoplePickerChange={this._onPeoplePickerChange}
              onChangeDate={this._onChangeDate}
              onClose={this._onClose}
              onSave={this._onSave}
              editMode={true} />
          }
          {(this.state.currentItem.requestStatus === strings.statusValues[1] && formsService.formView === FormView.EDIT) &&
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
                    editMode={false} />
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
                  editMode={true} />
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
                    <Step1
                      currentItem={this.state.currentItem}
                      onChangeValue={this._onChangeValue}
                      onChangeString={this._onChangeString}
                      onPeoplePickerChange={this._onPeoplePickerChange}
                      onChangeDate={this._onChangeDate}
                      onClose={this._onClose}
                      onSave={this._onSave}
                      editMode={false} />
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
                      editMode={false} />
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
                  editMode={true} />
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
                    <Step1
                      currentItem={this.state.currentItem}
                      onChangeValue={this._onChangeValue}
                      onChangeString={this._onChangeString}
                      onPeoplePickerChange={this._onPeoplePickerChange}
                      onChangeDate={this._onChangeDate}
                      onClose={this._onClose}
                      onSave={this._onSave}
                      editMode={false} />
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
                      editMode={false} />
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
                  editMode={false} />
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
      {this._renderForm()}
      {/* {formsService.formView !== FormView.VIEW &&
       
      }else{
        this._renderView()
      } */}





    </div>;
  }
}
