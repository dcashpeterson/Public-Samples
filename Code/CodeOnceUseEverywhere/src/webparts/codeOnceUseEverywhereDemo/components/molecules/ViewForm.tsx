import * as React from "react";
import { Client } from "../../../../models/models";
import HOOTable, { HOOTableStyle } from "@n8d/htwoo-react/HOOTable";

export interface IViewFormProps {
  client: Client
}

export interface IViewFormState {
}

export class ViewFormState implements IViewFormState {
}

export default class ViewForm extends React.PureComponent<IViewFormProps, IViewFormState> {
  private LOG_SOURCE = "🔶 ViewForm";

  public constructor(props: IViewFormProps) {
    super(props);
    this.state = new ViewFormState();
  }

  public render(): React.ReactElement<IViewFormProps> {
    try {
      return (
        <HOOTable tableStyle={HOOTableStyle.Normal} data-component={this.LOG_SOURCE}>
          <tbody>
            <tr>
              <td className="formLabel">Company Name</td>
              <td>{this.props.client.companyName}</td>
            </tr>
            <tr>
              <td className="formLabel">Contact Name</td>
              <td>{this.props.client.contactName}</td>
            </tr>
            <tr>
              <td className="formLabel">Contact Title</td>
              <td>{this.props.client.contactTitle}</td>
            </tr>
            <tr>
              <td className="formLabel">Contact Email</td>
              <td> {(this.props.client.contactEmail) &&
                <a href={`mailto:${this.props.client.contactEmail}`}>{this.props.client.contactEmail}</a>
              }</td>
            </tr>
            <tr>
              <td className="formLabel">Contact Phone</td>
              <td> {(this.props.client.contactPhone) &&
                <a href={`tel:${this.props.client.contactPhone}`}>{this.props.client.contactPhone}</a>
              }</td>
            </tr>
            <tr>
              <td className="formLabel">Project Name</td>
              <td>{this.props.client.projectName}</td>
            </tr>
            <tr>
              <td className="formLabel">Project Description</td>
              <td>{this.props.client.projectDescription}</td>
            </tr>
            <tr>
              <td className="formLabel">Sales Lead</td>
              <td>{this.props.client.salesLeadName}</td>
            </tr>
            <tr>
              <td className="formLabel">Pipeline Status</td>
              <td>{this.props.client.pipelineStatus}</td>
            </tr>
            <tr>
              <td className="formLabel">Last Contact Date</td>
              <td>{new Date(this.props.client.lastContactDate).toLocaleDateString()}</td>
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