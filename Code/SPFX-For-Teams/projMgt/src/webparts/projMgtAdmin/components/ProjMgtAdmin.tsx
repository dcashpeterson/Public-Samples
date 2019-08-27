import * as React from 'react';
import styles from './ProjMgtAdmin.module.scss';
import { IProjMgtAdminProps } from './IProjMgtAdminProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Client } from '../models/Models';
import { FontWeights } from '@uifabric/styling';
import { Card, ICardSectionStyles, ICardSectionTokens } from '@uifabric/react-cards';
import { Icon, IIconStyles } from 'office-ui-fabric-react/lib/Icon';
import { Stack, IStackTokens, Text, ITextStyles, Modal, DefaultButton, TextField, PrimaryButton } from 'office-ui-fabric-react';
import { Logger, ConsoleListener, LogLevel } from '@pnp/logging';
import { Web } from '@pnp/sp';
import { TeamService, ITeamService } from '../services/TeamService'

//Set up the state interface
export interface IProjMgtAdminState {
  showModal: boolean;
  newClient: Client;
  clients: Client[];
}

//Set up state to monitor changes
export class ProjMgtAdminState implements IProjMgtAdminState {
  constructor(
    public showModal: boolean = false,
    public newClient: Client = new Client(),
    public clients: Client[] = []
  ) { }
}

export default class ProjMgtAdmin extends React.Component<IProjMgtAdminProps, IProjMgtAdminState> {
  //Set up all the private variables we are going to use in thet web part
  private LOG_SOURCE: string = "Project Management Admin WebPart";
  private _teamService: ITeamService;

  //Set up the state when the web part loads
  constructor(props) {
    super(props);
    this.state = new ProjMgtAdminState(
      false,
      new Client(),
      this.props.clients
    );
    this._onInit();
  }

  //Set up the page. Call all functions to get data.
  private _onInit = async (): Promise<boolean> => {
    //This is a promise so it need to have a return value
    let returnValue: boolean = false;

    try {
      //Get access to the Teams Service for use later
      this._teamService = new TeamService(this.props.spContext);
    
      // subscribe a listener for error handling
      Logger.subscribe(new ConsoleListener());

      // set the active log level
      Logger.activeLogLevel = LogLevel.Info;
      
      //We passed in the list of clients
      //Set it to the state variable so hte webpart can be stateful and recognize changes
      this.setState({ clients: this.props.clients });
      returnValue = true;

    } catch (err) {
      Logger.write(`${err} - ${this.LOG_SOURCE} (_onInit)`, LogLevel.Error);
      returnValue = false;
    }

    return returnValue;
  }

  //Trap any changes on the form fields
  private _textFieldChanged = (newValue: string, fieldName: string): void => {
    try {
      //Set the state value for newClient to local variable
      let newClient: Client = this.state.newClient;
      //Set the value for the field
      newClient[fieldName] = newValue;
      //Set the value back into Statet
      this.setState({ newClient: newClient });
    } catch (err) {
      Logger.write(`${err} - ${this.LOG_SOURCE} (textFieldChanged)`, LogLevel.Error);
    }
  }

  //Simple error handling for the form
  private _getErrorMessage = (value: string): string => {
    if (value.length == 0) {
      return "This field is required";
    } else {
      return '';
    }
  }

  //Clear out the modal dialog
  private _clearModal = (): void => {
    let newClient: Client = new Client();

    this.setState({
      newClient: newClient
    })
  }

  //Show Modal
  private _showModal = (): void => {
    this.setState({ showModal: true });
  }

  //Close Modal
  private _closeModal = (): void => {
    this.setState({ showModal: false });
  };

  //Cancel the modal
  private _cancelModal = (): void => {
    //We want to close the modal and clear out the values
    this._clearModal();
    this._closeModal();
  }

  //Save the data back to SharePoint
  private async _saveClient(): Promise<void> {
    //Save to SharePoint
    await this._saveDataToSharePoint(this.state.newClient)
    //Clear and close the modal
    this._clearModal();
    this._closeModal();
  }

  //Save the data into SharePoint
  private async _saveDataToSharePoint(client: Client): Promise<void> {
    //Create a Web basedon the admin URL passed in
    let web = new Web(this.props.adminSiteCollection);
    //Create a new Office 365 Group for the new client
    let group = await this._teamService.createChannel(this.props.teamsContext.groupId,client.name);

    //Save the item into the SharePoint listt
    let result = await web.lists.getByTitle(this.props.adminListName).items.add({
      Title: client.name,
      WorkAddress: client.address,
      WorkCity: client.city,
      WorkState: client.state,
      WorkZip: client.zip
    });

    //Add the new client to the list of clients
    //This re-renders the component
    let tempClients: Client[] = this.state.clients;
    tempClients.push(client);
    this.setState({
      clients: tempClients
    });
  }

  public render(): React.ReactElement<IProjMgtAdminProps> {

    return (
      <div className={styles.projMgtAdmin}>
        <Stack horizontal tokens={sectionStackTokens} className={styles.stack}>
          {
            this.state.clients.map((client: Client) => {
              return (

                <Card styles={backgroundImageCardSectionStyles} className={styles.card}>
                  <Card.Section fill verticalAlign="end" styles={backgroundImageCardSectionStyles} tokens={backgroundImageCardSectionTokens}>
                    <Text variant="large" styles={dateTextStyles}>{client.name}</Text>

                  </Card.Section>
                  <Card.Section fill verticalAlign="end" styles={backgroundImageCardSectionStyles} tokens={backgroundImageCardSectionTokens}>
                    <Text variant="small" styles={subduedTextStyles}>Address</Text>
                    <Text styles={descriptionTextStyles}>{client.address}</Text>
                    <Text styles={descriptionTextStyles}>{client.city}, {client.state} {client.zip}</Text>
                  </Card.Section>
                  <Card.Section fill verticalAlign="end" styles={backgroundImageCardSectionStyles} tokens={backgroundImageCardSectionTokens}>
                    <Text variant="small" styles={subduedTextStyles}>Last Modified</Text>
                    <Text variant="small" styles={subduedTextStyles}>{client.lastModified.toLocaleDateString()}</Text>
                  </Card.Section>
                  <Card.Item grow={1}>
                    <span />
                  </Card.Item>
                  <Card.Section horizontal styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
                    <Icon iconName="EditNote" styles={iconStyles} />
                    <Icon iconName="AddEvent" styles={iconStyles} />
                    <Icon iconName="Calendar" styles={iconStyles} />
                    <Icon iconName="Delete" styles={iconStyles} />
                    <Stack.Item grow={1}>
                      <span />
                    </Stack.Item>
                    
                  </Card.Section>


                </Card>

              );
            })

          }
          <Card styles={backgroundImageCardSectionStyles} className={styles.card}>
            <Card.Section fill verticalAlign="end" styles={backgroundImageCardSectionStyles} tokens={backgroundImageCardSectionTokens}>
              <Text variant="large" styles={descriptionTextStyles}><a href="#" onClick={() => this._showModal()} className={styles.link}>Add New Client</a></Text>
            </Card.Section>
          </Card>
        </Stack>
        <Modal
          titleAriaId={"Add New Client"}
          subtitleAriaId={""}
          isOpen={this.state.showModal}
          onDismiss={this._closeModal}
          isBlocking={false}
          containerClassName={"modal"}
        >
          <div className={"header"}>
            <span >Add New Client <Icon iconName="ChromeClose" className={"iconClass"} onClick={this._closeModal} /></span>
          </div>
          <div >
            <TextField
              label="Client Name"
              value={this.state.newClient.name}
              required={true}
              onChanged={(newValue) => { this._textFieldChanged(newValue, "name"); }}
              autoFocus={true}
              onGetErrorMessage={this._getErrorMessage}
            />

            <TextField
              label="Address"
              value={this.state.newClient.address}
              required={true}
              onChanged={(newValue) => { this._textFieldChanged(newValue, "address"); }}
              autoFocus={true}
              onGetErrorMessage={this._getErrorMessage}
            />

            <TextField
              label="City"
              value={this.state.newClient.city}
              required={true}
              onChanged={(newValue) => { this._textFieldChanged(newValue, "city"); }}
              autoFocus={true}
              onGetErrorMessage={this._getErrorMessage}
            />
            <TextField
              label="State"
              value={this.state.newClient.state}
              required={true}
              onChanged={(newValue) => { this._textFieldChanged(newValue, "state"); }}
              autoFocus={true}
              onGetErrorMessage={this._getErrorMessage}
            />
            <TextField
              label="Zip"
              value={this.state.newClient.zip}
              required={true}
              onChanged={(newValue) => { this._textFieldChanged(newValue, "zip"); }}
              autoFocus={true}
              onGetErrorMessage={this._getErrorMessage}
            />
            <PrimaryButton
              data-automation-id="test"
              text="Save Client"
              onClick={() => { this._saveClient(); }}
              allowDisabledFocus={true}
              className={"button"}

            />
            <DefaultButton
              data-automation-id="test"
              allowDisabledFocus={true}
              text="Cancel"
              onClick={() => { this._cancelModal(); }}
              className={"button cancelButton"}
            />

          </div>
        </Modal>
      </div>
    );
  }
}

//Set up styles for the card component
const descriptionTextStyles: ITextStyles = {
  root: {
    color: '#333333',
    fontWeight: FontWeights.semibold

  }
};
const backgroundImageCardSectionStyles: ICardSectionStyles = {
  root: {
    backgroundColor: '#ffffff'

  }
};
const dateTextStyles: ITextStyles = {
  root: {
    color: '#505050',
    fontWeight: 600
  }
};
const subduedTextStyles: ITextStyles = {
  root: {
    color: '#666666',
    paddingTop: 0
  }
};

const sectionStackTokens: IStackTokens = { childrenGap: 30 };
const backgroundImageCardSectionTokens: ICardSectionTokens = { padding: 12 };
const footerCardSectionStyles: ICardSectionStyles = {
  root: {
    borderTop: '1px solid #F3F2F1'
  }
};
const iconStyles: IIconStyles = {
  root: {
    color: '#0078D4',
    fontSize: 16,
    fontWeight: FontWeights.regular
  }
};
const footerCardSectionTokens: ICardSectionTokens = { padding: '12px' };
