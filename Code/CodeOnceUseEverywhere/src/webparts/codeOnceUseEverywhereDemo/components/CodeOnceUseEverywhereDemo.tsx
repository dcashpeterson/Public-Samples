import * as React from 'react';
import styles from './CodeOnceUseEverywhereDemo.module.scss';
import { ICodeOnceUseEverywhereDemoProps } from './ICodeOnceUseEverywhereDemoProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import HOOTable, { HOOTableStyle } from '@n8d/htwoo-react/HOOTable';
import { Client, Environment, FormView } from '../../../models/models';
import HOOIcon from '@n8d/htwoo-react/HOOIcon';
import HOOWebPartTitle from '@n8d/htwoo-react/HOOWebPartTitle';
import Dialog from './molecules/Dialog';
import ViewForm from './molecules/ViewForm';
import EditForm from './molecules/EditForm';
import { COService } from '../../../services/CodeOnce.Service';
import HOOButton from '@n8d/htwoo-react/HOOButton';
import * as strings from 'CodeOnceUseEverywhereDemoWebPartStrings';

export interface ICodeOnceUseEverywhereDemoState {
  dialogVisibility: boolean;
  dialogView: FormView;
  currentClient: Client;
  clients: Client[];
}
export class CodeOnceUseEverywhereDemoState implements ICodeOnceUseEverywhereDemoState {
  constructor(
    public dialogVisibility: boolean = false,
    public dialogView: FormView = FormView.VIEW,
    public currentClient: Client = new Client(),
    public clients: Client[] = []
  ) { }
}

export default class CodeOnceUseEverywhereDemo extends React.Component<ICodeOnceUseEverywhereDemoProps, ICodeOnceUseEverywhereDemoState> {
  private LOG_SOURCE = "🔶 CodeOnceUseEverywhereDemoProps";
  private _currentDate = "";
  private _webpartTitle = "";

  public constructor(props: ICodeOnceUseEverywhereDemoProps) {
    super(props);
    const now: Date = new Date();
    this._currentDate = `${now.getFullYear}-${now.getMonth}-${now.getDate}`;
    switch (this.props.environment) {
      case Environment.OFFICE: // running in Office
        this._webpartTitle = strings.OfficeAppTitle;
        break;
      case Environment.OUTLOOK: // running in Outlook
        this._webpartTitle = strings.OutlookAppTitle;
        break;
      case Environment.TEAM: // running in Teams
        this._webpartTitle = strings.OfficeAppTitle;
        break;
      case Environment.PERSONALAPP: // running in Personal APP
        this._webpartTitle = strings.PersonalAppTitle;
        break;
      case Environment.SHAREPOINT: // running in SharePoint
        this._webpartTitle = strings.SharePointAppTitle;
        break;
      default:
        throw new Error('Unknown host');
    }
    this.state = new CodeOnceUseEverywhereDemoState(false, FormView.VIEW, new Client(), this.props.clients);
  }

  private _updateFormVisibility = (view: FormView, client: Client): void => {
    this.setState({ dialogVisibility: !this.state.dialogVisibility, dialogView: view, currentClient: client });
  }

  private _deleteItem = async (id: number): Promise<void> => {
    await COService.DeleteItem(id);
    const clients: Client[] = await COService.GetItems(this.props.environment, COService.currentUser.Id);
    this.setState({ clients: clients, dialogVisibility: false, dialogView: FormView.VIEW, currentClient: new Client() });
  }

  private _saveItem = async (client: Client): Promise<void> => {
    client.salesLeadId = COService.currentUser.Id;
    client.salesLeadName = COService.currentUser.Title;
    await COService.SaveItem(client);
    const clients: Client[] = await COService.GetItems(this.props.environment, COService.currentUser.Id);
    this.setState({ clients: clients, dialogVisibility: !this.state.dialogVisibility, dialogView: FormView.VIEW, currentClient: new Client() });
  }

  private _updateItem = async (client: Client): Promise<void> => {
    await COService.UpdateItem(client);
    const clients: Client[] = await COService.GetItems(this.props.environment, COService.currentUser.Id);
    this.setState({ clients: clients, dialogVisibility: !this.state.dialogVisibility, dialogView: FormView.VIEW, currentClient: new Client() });
  }


  public render(): React.ReactElement<ICodeOnceUseEverywhereDemoProps> {
    try {
      return (
        <div className={`${styles.codeOnceUseEverywhereDemo} ${(Environment.OUTLOOK) ? "outlook" : ""}`}>
          <div className={styles.newButton}><HOOButton
            label="New"
            onClick={() => this._updateFormVisibility(FormView.NEW, new Client())}
            type={1}
          /></div>
          <HOOWebPartTitle
            editMode
            placeholder="Web Part Title"
            title={this._webpartTitle}
            updateTitle={function noRefCheck() { }}
          />
          <HOOTable tableStyle={HOOTableStyle.Normal}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Name</th>
                <th>Email</th>
                <th>Project Name</th>
                <th>Status</th>
                <th>Last Contact Date</th>
                {(this.props.environment !== Environment.PERSONALAPP) &&
                  <th>Sales Lead</th>
                }
                <th>View</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {this.state.clients.map((c, index) => {
                return (
                  <tr key={index}>
                    <td>{c.companyName}</td>
                    <td>{c.contactName}</td>
                    <td><a href={`https://outlook.office.com/mail/deeplink/compose?to=${c.contactEmail}&subject=${c.projectName}`} target='_blank'>{c.contactEmail}</a></td>
                    <td>{c.projectName}</td>
                    <td>{c.pipelineStatus}</td>
                    <td>{new Date(c.lastContactDate).toLocaleDateString()}</td>
                    {(this.props.environment !== Environment.PERSONALAPP) &&
                      <td>{c.salesLeadName}</td>
                    }
                    <td><HOOIcon
                      iconName="icon-document-one-page-regular"
                      iconLabel='View'
                      rootElementAttributes={{
                        onClick: () => this._updateFormVisibility(FormView.VIEW, c)
                      }}
                    />
                    </td>
                    <td><HOOIcon
                      iconName="icon-edit-regular"
                      iconLabel='Edit'
                      rootElementAttributes={{
                        onClick: () => this._updateFormVisibility(FormView.EDIT, c)
                      }}
                    /></td>
                    <td><HOOIcon
                      iconName="icon-delete-regular"
                      iconLabel='Delete'
                      rootElementAttributes={{
                        onClick: () => this._deleteItem(c.id)
                      }}
                    /></td>
                  </tr>
                );
              })}
            </tbody>
          </HOOTable>
          <Dialog visability={this.state.dialogVisibility} title={'Pipeline Form'} dialogView={this.state.dialogView} onClose={() => this._updateFormVisibility(FormView.VIEW, new Client())}>
            {(this.state.dialogView === FormView.VIEW) &&
              <ViewForm client={this.state.currentClient} />
            }
            {(this.state.dialogView === FormView.EDIT) &&
              <EditForm client={this.state.currentClient} onCancel={this._updateFormVisibility} onSave={this._updateItem} />
            }
            {(this.state.dialogView === FormView.NEW) &&
              <EditForm client={new Client(0, "", "", "", "", "", "", "", COService.currentUser.Title, COService.currentUser.Id, "", this._currentDate)} onCancel={this._updateFormVisibility} onSave={this._saveItem} />
            }
          </Dialog>

        </div>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return null;
    }

  }
}

