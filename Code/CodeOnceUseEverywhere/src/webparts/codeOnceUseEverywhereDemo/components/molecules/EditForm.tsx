import * as React from "react";
import { Client, FormView } from "../../../../models/models";
import HOOTable, { HOOTableStyle } from "@n8d/htwoo-react/HOOTable";
import HOOText from "@n8d/htwoo-react/HOOText";
import HOODate from "@n8d/htwoo-react/HOODate";
import HOODropDown from "@n8d/htwoo-react/HOODropDown";
import { cloneDeep } from "@microsoft/sp-lodash-subset";
import HOOButton from "@n8d/htwoo-react/HOOButton";

export interface IEditFormProps {
  client: Client
  onSave: (client: Client) => void;
  onCancel: (view: FormView, client: Client) => void;
}

export interface IEditFormState {
  client: Client
}

export class EditFormState implements IEditFormState {
  public constructor(public client: Client = new Client()) { }
}

export default class EditForm extends React.PureComponent<IEditFormProps, IEditFormState> {
  private LOG_SOURCE = "🔶EditForm";

  public constructor(props: IEditFormProps) {
    super(props);
    this.state = new EditFormState(this.props.client);
  }

  private _onTextChange = (fieldValue: string, fieldName: string): void => {
    try {
      const client = cloneDeep(this.state.client);
      client[fieldName] = fieldValue;
      this.setState({ client: client });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_onTextChange) - ${err}`);
    }
  }

  public render(): React.ReactElement<IEditFormProps> {
    try {
      return (
        <HOOTable tableStyle={HOOTableStyle.Normal} data-component={this.LOG_SOURCE}>
          <tbody>
            <tr>
              <td className="formLabel">Company Name</td>
              <td><HOOText
                onChange={(newValue) => { this._onTextChange(newValue.target.value, "companyName"); }}
                value={this.state.client.companyName} /></td>
            </tr>
            <tr>
              <td className="formLabel">Contact Name</td>
              <td><HOOText
                onChange={(newValue) => { this._onTextChange(newValue.target.value, "contactName"); }}
                value={this.state.client.contactName} /></td>
            </tr>
            <tr>
              <td className="formLabel">Contact Title</td>
              <td><HOOText
                onChange={(newValue) => { this._onTextChange(newValue.target.value, "contactTitle"); }}
                value={this.state.client.contactTitle} /></td>
            </tr>
            <tr>
              <td className="formLabel">Contact Email</td>
              <td><HOOText
                onChange={(newValue) => { this._onTextChange(newValue.target.value, "contactEmail"); }}
                value={this.state.client.contactEmail} /></td>
            </tr>
            <tr>
              <td className="formLabel">Contact Phone</td>
              <td><HOOText
                onChange={(newValue) => { this._onTextChange(newValue.target.value, "contactPhone"); }}
                value={this.state.client.contactPhone} /></td>
            </tr>
            <tr>
              <td className="formLabel">Project Name</td>
              <td><HOOText
                onChange={(newValue) => { this._onTextChange(newValue.target.value, "projectName"); }}
                value={this.state.client.projectName} /></td>
            </tr>
            <tr>
              <td className="formLabel">Project Description</td>
              <td><HOOText
                onChange={(newValue) => { this._onTextChange(newValue.target.value, "projectDescription"); }}
                value={this.state.client.projectDescription} multiline={6} /></td>
            </tr>
            <tr>
              <td className="formLabel">Sales Lead</td>
              <td>{this.state.client.salesLeadName}</td>
            </tr>
            <tr>
              <td className="formLabel">Pipeline Status</td>
              <td><HOODropDown
                onChange={(newValue) => { this._onTextChange(newValue.toString(), "pipelineStatus"); }}
                options={[
                  {
                    groupItems: [
                      {
                        disabled: false,
                        key: '1. Referred',
                        text: '1. Referred'
                      },
                      {
                        disabled: false,
                        key: '2. In negotiation',
                        text: '2. In negotiation'
                      },
                      {
                        disabled: false,
                        key: '3. On Hold',
                        text: '3. On Hold'
                      },
                      {
                        disabled: false,
                        key: '4. Closed - Won',
                        text: '4. Closed - Won'
                      },
                      {
                        disabled: false,
                        key: '5. Closed - Lost',
                        text: '5. Closed - Lost'
                      },
                      {
                        disabled: false,
                        key: '6. Closed - Declined',
                        text: '6. Closed - Declined'
                      }
                    ],
                    groupName: ''
                  }
                ]}
                value={this.state.client.pipelineStatus} containsTypeAhead={true} /></td>
            </tr>
            <tr>
              <td className="formLabel">Last Contact Date</td>
              <td><HOODate
                onChange={(newValue) => { this._onTextChange(newValue.target.value, "lastContactDate"); }}
                value={new Date(this.state.client.lastContactDate).toLocaleDateString()}
              /></td>
            </tr>
            <tr>
              <td><HOOButton
                label="Save"
                onClick={() => this.props.onSave(this.state.client)}
                type={1}
              /></td>
              <td><HOOButton
                label="Cancel"
                onClick={() => this.props.onCancel(FormView.VIEW, new Client())}
                type={1}
              /></td>
            </tr>
          </tbody>
        </HOOTable>
      );
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (render) - ${err}`);
      return null;
    }
  }
}