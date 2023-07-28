import * as React from 'react';
import { Log } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import styles from './VacationRequest.module.scss';
import { FormMode, VacationRequestItem, demoWebUrl } from '../common/models/models';
import { VRService } from '../common/services/VacationRequest.Service';
import NewEditForm from './NewEditForm';
import DisplayForms from './DisplayForms';

export interface IVacationRequestProps {
  context: FormCustomizerContext;
  formMode: FormMode;
  requests: VacationRequestItem[];
  currentItem: VacationRequestItem;
  onSave: () => void;
  onClose: () => void;
}

export interface IVacationRequestState {
  requests: VacationRequestItem[];
}

export class VacationRequestState implements IVacationRequestState {
  constructor(
    public requests: VacationRequestItem[]
  ) { }
}

const LOG_SOURCE: string = 'VacationRequest';

export default class VacationRequest extends React.Component<IVacationRequestProps, IVacationRequestState> {

  constructor(props: IVacationRequestProps) {
    super(props);
    this.state = new VacationRequestState(this.props.requests);
  }

  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: VacationRequest mounted');
  }

  public componentWillUnmount(): void {

    Log.info(LOG_SOURCE, 'React Element: VacationRequest unmounted');
  }

  private _updateRequests = async (approvalStatus: string): Promise<void> => {
    try {
      const requests: VacationRequestItem[] = await VRService.GetRequests(this.props.context.pageContext.user.email, approvalStatus);
      this.setState({ requests: requests });

    } catch (err) {
      console.error(`${LOG_SOURCE} (UpdateRequests) - ${err}`);
    }
  }

  private _changeForm = (modeID: number): void => {
    try {
      const url = `${demoWebUrl}/_layouts/15/SPListForm.aspx?PageType=${modeID}&List=${this.props.context.list.guid}${(modeID !== 8) ? 'ID=' + this.props.context.itemId : ''}&Source=${this.props.context.list.serverRelativeUrl}&ContentTypeId=${this.props.context.contentType.id}`;
      window.location.replace(url);

    } catch (err) {
      console.error(`${LOG_SOURCE} (_changeForm) - ${err}`);
    }
  };

  public render(): React.ReactElement<{}> {
    return <div className={styles.vacationRequest}>
      {
        this.props.formMode === FormMode.DISPLAYVIEW &&
        <DisplayForms currentItem={this.props.currentItem} requests={this.state.requests} updateRequests={this._updateRequests} changeForm={this._changeForm} />
      }
      {
        ((this.props.formMode === FormMode.NEWVIEW) || (this.props.formMode === FormMode.EDITVIEW)) &&
        <NewEditForm currentItem={this.props.currentItem} formMode={this.props.formMode} onSave={this.props.onSave} onClose={this.props.onClose} />
      }
    </div>;
  }
}
