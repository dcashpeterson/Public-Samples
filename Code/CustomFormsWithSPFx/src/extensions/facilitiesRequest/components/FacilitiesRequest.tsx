import * as React from 'react';
import { Log } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import styles from './FacilitiesRequest.module.scss';
import { FacilitiesRequestItem, FormView, IFacilitiesRequestItem } from '../../../common/models/models';
import { PeoplePicker } from '@microsoft/mgt-react';
import HOOText from '@n8d/htwoo-react/HOOText';
import HOODropDown from '@n8d/htwoo-react/HOODropDown';
import { formsService } from '../../../common/services/formsService';
import { cloneDeep } from '@microsoft/sp-lodash-subset';

export interface IFacilitiesRequestProps {
  context: FormCustomizerContext;
  formView: FormView;
  currentItem: FacilitiesRequestItem;
  onSave: () => void;
  onClose: () => void;
}

const LOG_SOURCE: string = '🏳️‍🌈 FacilitiesRequest';


export default class FacilitiesRequest extends React.Component<IFacilitiesRequestProps> {
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: FacilitiesRequest mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: FacilitiesRequest unmounted');
  }

  private _formValid = (currentItem: IFacilitiesRequestItem): string => {
    let retVal: string = "Form is not valid";
    try {
      const validString: string[] = [];
      if (currentItem.title == null || currentItem.title?.length < 1) {
        validString.push("Title is a require field.");
      }
      // if (currentItem..ToolUrl?.Url == null || currentItem.ToolUrl?.Url.length < 1) {
      //   validString.push("Tool Url is a require field.");
      // } else if (currentItem.ToolUrl.Url.indexOf("http") < 0) {
      //   validString.push("Tool Url must be a valid web url.");
      // }
      // if (currentItem.ToolOwnerId == null || currentItem.ToolOwnerId?.toString().length < 1) {
      //   validString.push("Tool Owner is a require field.");
      // }
      // if (currentItem.BackupToolOwnerId == null || currentItem.BackupToolOwnerId?.toString().length < 1) {
      //   validString.push("Backup Tool Owner is a require field.");
      // }
      // if (currentItem.ToolImage == null || currentItem.ToolImage?.length < 1) {
      //   validString.push("Tool Image is a require field.");
      // }
      retVal = validString.join(" ");
    } catch (err) {
      console.error(`${LOG_SOURCE} (_formValid) - ${err}`);
    }
    return retVal;
  }

  private _onChangeString = (fieldName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subField?: string, fieldType?: string): void => {
    try {
      const value = event.target.value;
      const currentItem: any = cloneDeep(this.props.currentItem);
      if (subField) {
        if (currentItem[fieldName] == null) {
          if (fieldType === "Hyperlink") {
            currentItem[fieldName] = new Hyperlink();
          }
        }
        currentItem[fieldName][subField] = value;
      } else {
        currentItem[fieldName] = value;
      }
      const valid = this._formValid(currentItem);
      this.setState({ currentItem, dirty: true, valid });
    } catch (err) {
      console.error(LOG_SOURCE, "(_onChangeString)", err);
    }
  }

  private _onChangeValue = (fieldName: string, value: string | number | boolean): void => {
    try {
      const currentItem: any = cloneDeep(this.props.currentItem);
      currentItem[fieldName] = value;
      const valid = this._formValid(currentItem);
      this.setState({ currentItem, dirty: true, valid });
    } catch (err) {
      console.error(`${LOG_SOURCE} (_onChangeValue) - ${err}`);
    }
  }

  public render(): React.ReactElement<IFacilitiesRequestProps> {
    return <div className={styles.facilitiesRequest} >{this.props.formView}
      <PeoplePicker id='requestor' type='person' onChange={function noRefCheck() { }}></PeoplePicker>
      <HOOText
        multiline={5}
        value={this.props.currentItem.requestDescription}
        onChange={(event) => { this._onChangeString("requestDescription", event); }}
      />
      <HOODropDown
        value={0}
        options={formsService.RequestStatusValues}
        containsTypeAhead={false}
        onChange={(value) => { this._onChangeValue("requestStatus", value); }}
      />
      <HOODropDown
        value={0}
        options={formsService.ResponsibleDepartmentValues}
        containsTypeAhead={false}
        onChange={(value) => { this._onChangeValue("responsibleDepartment", value); }}
      />
      <PeoplePicker id='assignee' type='person' onChange={function noRefCheck() { }}></PeoplePicker>
      <HOOText
        multiline={5}
        value={""}
        onChange={(event) => { this._onChangeString("serviceNotes", event); }}
      />
    </div>;
  }
}
