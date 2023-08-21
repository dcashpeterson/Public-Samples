import * as React from 'react';
import { Log } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import styles from './ProjectTrackerForm.module.scss';

import NewEditForm from './NewEditForm';
import { FormMode, ProjectTrackerItem, demoWebUrl } from '../common/models/models';
import DisplayForm from './DisplayForm';

export interface IProjectTrackerFormProps {
  context: FormCustomizerContext;
  formMode: FormMode;
  currentItem: ProjectTrackerItem;
  onSave: () => void;
  onClose: () => void;
}

export interface IProjectTrackerFormState {
}

export class ProjectTrackerFormState implements IProjectTrackerFormState {
  constructor(
  ) { }
}

const LOG_SOURCE: string = 'ProjectTrackerForm';

export default class ProjectTracker extends React.Component<IProjectTrackerFormProps, IProjectTrackerFormState> {

  constructor(props: IProjectTrackerFormProps) {
    super(props);
    this.state = new ProjectTrackerFormState();
  }

  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: ProjectTrackerForm mounted');
  }

  public componentWillUnmount(): void {

    Log.info(LOG_SOURCE, 'React Element: ProjectTrackerForm unmounted');
  }

  private _changeForm = (modeID: number): void => {
    try {
      let url = `${demoWebUrl}/_layouts/15/SPListForm.aspx?PageType=${modeID}&List=${this.props.context.list.guid}${(modeID !== 8) ? '&ID=' + this.props.context.itemId : ''}&Source=${this.props.context.list.serverRelativeUrl}&ContentTypeId=${this.props.context.contentType.id}`;
      window.location.replace(url);

    } catch (err) {
      console.error(`${LOG_SOURCE} (_changeForm) - ${err}`);
    }
  };

  public render(): React.ReactElement<{}> {
    return <div className={styles.projectTrackerForm}>
      {
        this.props.formMode === FormMode.DISPLAYVIEW &&
        <DisplayForm currentItem={this.props.currentItem} changeForm={this._changeForm} onClose={this.props.onClose} />
      }
      {
        ((this.props.formMode === FormMode.NEWVIEW) || (this.props.formMode === FormMode.EDITVIEW)) &&
        <NewEditForm context={this.props.context} currentItem={this.props.currentItem} formMode={this.props.formMode} onSave={this.props.onSave} onClose={this.props.onClose} />
      }
    </div>;
  }
}
