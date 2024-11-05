import * as React from 'react';
import { Log } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import styles from './FacilitiesRequest.module.scss';
import { FacilitiesRequestItem, FormView, IFacilitiesRequestItem, SaveType } from '../../../common/models/models';
import { IDynamicPerson, PeoplePicker } from '@microsoft/mgt-react';
import HOOText from '@n8d/htwoo-react/HOOText';
import HOODropDown from '@n8d/htwoo-react/HOODropDown';
import { formsService } from '../../../common/services/formsService';
import { cloneDeep } from '@microsoft/sp-lodash-subset';
import HOOButton from '@n8d/htwoo-react/HOOButton';
import * as strings from 'FacilitiesRequestFormCustomizerStrings';
import HOOLabel from '@n8d/htwoo-react/HOOLabel';
import HOOPersona from '@n8d/htwoo-react/HOOPersona';
import HOOAvatarPres, { HOOAvatarSize, HOOPresenceStatus } from '@n8d/htwoo-react/HOOAvatarPres';
import HOOCheckbox from '@n8d/htwoo-react/HOOCheckbox';

export interface IFacilitiesRequestProps {
  context: FormCustomizerContext;
  currentItem: FacilitiesRequestItem;
  onSave: (currentItem: FacilitiesRequestItem) => void;
  onClose: () => void;
}

export interface IFacilitiesRequestState {
  currentItem: IFacilitiesRequestItem;
  selectedMenu: string;
  error: string[];
}

export class FacilitiesRequestState implements IFacilitiesRequestState {
  constructor(
    public currentItem: IFacilitiesRequestItem = new FacilitiesRequestItem(),
    public selectedMenu: string = "New Request",
    public error: string[] = []
  ) { }
}

const LOG_SOURCE: string = '🏳️‍🌈 FacilitiesRequest';


export default class FacilitiesRequest extends React.Component<IFacilitiesRequestProps, IFacilitiesRequestState> {
  private selectedRequestors: IDynamicPerson[] = [];
  private selectedAssignee: IDynamicPerson[] = [];

  public constructor(props: IFacilitiesRequestProps) {
    super(props);
    try {
      const listItem: IFacilitiesRequestItem = (props.currentItem) ? cloneDeep(props.currentItem) : new FacilitiesRequestItem();

      if (listItem.requestor) {
        this.selectedRequestors = [{ displayName: listItem.requestor.displayName, mail: listItem.requestor.email, userPrincipalName: listItem.requestor.email }];
      } else {
        this.selectedRequestors = [{ displayName: props.context.pageContext.user.displayName, mail: props.context.pageContext.user.email, userPrincipalName: props.context.pageContext.user.email }];
        listItem.requestor = { displayName: props.context.pageContext.user.displayName, email: props.context.pageContext.user.email, loginName: props.context.pageContext.user.email, id: 0, photoUrl: "", presence: HOOPresenceStatus.Invisible };
      }
      if (listItem.assignee) {
        this.selectedAssignee = [{ displayName: listItem.assignee.displayName, mail: listItem.assignee.email, userPrincipalName: listItem.assignee.email }];
      }

      this.state = new FacilitiesRequestState(listItem, "New Request", []);
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

  private _formValid = (currentItem: IFacilitiesRequestItem): string[] => {
    const retVal: string[] = [];
    try {
      if (currentItem.requestor === null || currentItem.requestor?.displayName.length < 1) {
        retVal.push("Requestor is a require field.");
      }
      if (currentItem.requestDescription === null || currentItem.requestDescription?.length < 1) {
        retVal.push("Request Description is a require field.");
      }
    } catch (err) {
      console.error(`${LOG_SOURCE} (_formValid) - ${err}`);
    }
    return retVal;
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
      const error = this._formValid(currentItem);
      this.setState({ currentItem, error });
    } catch (err) {
      console.error(LOG_SOURCE, "(_onChangeString)", err);
    }
  }

  private _onChangeValue = (fieldName: string, value: string | number | boolean): void => {
    try {
      const currentItem: any = cloneDeep(this.state.currentItem);
      currentItem[fieldName] = value;
      const error = this._formValid(currentItem);
      this.setState({ currentItem, error });
    } catch (err) {
      console.error(`${LOG_SOURCE} (_onChangeValue) - ${err}`);
    }
  }

  private _onCompleteRequest = (fieldName: string, value: string | number | boolean): void => {
    try {
      const currentItem: any = cloneDeep(this.state.currentItem);
      if (value) {
        currentItem.requestStatus = strings.statusValues[5];
      }
      this.setState({ currentItem });
    } catch (err) {
      console.error(`${LOG_SOURCE} (_onCompleteRequest) - ${err}`);
    }
  }
  private _onSave = async (saveType: SaveType): Promise<void> => {
    try {
      const currentItem: FacilitiesRequestItem = cloneDeep(this.state.currentItem);
      const valid = this._formValid(currentItem);
      if (valid.length <= 0) {
        switch (this.state.currentItem.requestStatus) {
          case strings.statusValues[0]:
            currentItem.requestStatus = strings.statusValues[1];
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
    } catch (err) {
      console.error(`${LOG_SOURCE} (_onClose) - ${err}`);
    }
  }

  private _renderNew(): React.ReactElement<IFacilitiesRequestProps> {
    try {
      return (
        <div>
          <h2>{strings.newRequestHeader}</h2>
          <p>{strings.newRequestIntro}</p>
          <HOOLabel label={strings.requestorLabel} for='requestor' required={true} />
          <PeoplePicker id='requestor' type='person' aria-label='Requestor' ariaLabel='Requestor' showMax={4} selectionChanged={(e) => { this.selectedRequestors = e.detail; }} selectedPeople={this.selectedRequestors} />
          <HOOLabel label={strings.requestDescriptionLabel} for='requestDescription' required={true} />
          <HOOText
            forId='requestDescription'
            multiline={5}
            value={this.state.currentItem.requestDescription}
            onChange={(event) => { this._onChangeString("requestDescription", event); }}
          />
        </div>)
    } catch (err) {
      console.error(`${LOG_SOURCE} (_renderNew) - ${err}`);
      return <div>Error occurred while rendering the form. {err}</div>;
    }
  }

  private _renderEdit(): React.ReactElement<IFacilitiesRequestProps> {
    try {
      return (
        <div>
          <h2>{strings.editRequestHeader}</h2>
          <HOOLabel label={strings.requestorLabel} for='requestor' />
          <HOOPersona
            avatarSize={HOOAvatarSize.Px48}
            personaName={this.state.currentItem.requestor?.displayName}
          >
            <HOOAvatarPres
              imageAlt={this.state.currentItem.requestor?.displayName || 'No display name'}
              imageSource={this.state.currentItem.requestor?.photoUrl || ''}
              status={this.state.currentItem.requestor?.presence || HOOPresenceStatus.Invisible} />
          </HOOPersona>
          <HOOLabel label={strings.requestDescriptionLabel} for='requestDescription' />
          <div>{this.state.currentItem.requestDescription}</div>
          <hr />
          <h2>Assign To Department</h2>
          <HOOLabel label={strings.responsibleDepartmentLabel} for='responsibleDepartment' />
          <HOODropDown
            forId='responsibleDepartment'
            value={this.state.currentItem.responsibleDepartment}
            options={formsService.ResponsibleDepartmentValues}
            containsTypeAhead={false}
            onChange={(value) => { this._onChangeValue("responsibleDepartment", value); }}
          />
          <hr />
          <h2>Assign Worker</h2>
          <HOOLabel label={strings.assigneeLabel} for='assignee' />
          <PeoplePicker id='assignee' type='person' showMax={4} selectionChanged={(e) => { this.selectedAssignee = e.detail; }} selectedPeople={this.selectedAssignee} />
          <hr />
          <HOOLabel label={strings.serviceNotesLabel} for='serviceNotes' />
          <HOOText
            forId='serviceNotes'
            multiline={5}
            value={this.state.currentItem.serviceNotes}
            onChange={(event) => { this._onChangeString("serviceNotes", event); }}
          />
          <HOOCheckbox
            forId='closeRequest'
            label={strings.closeRequestLabel}
            checked={(this.state.currentItem.requestStatus === strings.statusValues[5]) ? true : false}
            onChange={(event) => { this._onCompleteRequest("requestStatus", (event.target as HTMLInputElement).checked); }} />

        </div>)
    } catch (err) {
      console.error(`${LOG_SOURCE} (_renderNew) - ${err}`);
      return <div>Error occurred while rendering the form. {err}</div>;
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
      {formsService.formView === FormView.NEW &&
        this._renderNew()
      }
      {formsService.formView === FormView.EDIT &&
        this._renderEdit()
      }

      <HOOButton
        label={strings.saveButton}
        onClick={() => this._onSave((formsService.formView === FormView.NEW) ? SaveType.NEW : SaveType.UPDATE)}
        type={1}
      />
      <HOOButton
        label={strings.cancelButton}
        onClick={this._onClose}
        type={2}
      />



    </div>;
  }
}
