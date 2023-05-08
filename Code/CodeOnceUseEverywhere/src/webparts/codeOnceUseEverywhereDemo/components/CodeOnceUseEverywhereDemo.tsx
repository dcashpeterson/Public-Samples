import * as React from 'react';
import styles from './CodeOnceUseEverywhereDemo.module.scss';
import { ICodeOnceUseEverywhereDemoProps } from './ICodeOnceUseEverywhereDemoProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import HOOTable, { HOOTableStyle } from '@n8d/htwoo-react/HOOTable';
import { Environment } from '../../../models/models';
import HOOIcon from '@n8d/htwoo-react/HOOIcon';
import HOOWebPartTitle from '@n8d/htwoo-react/HOOWebPartTitle';
import HOODialog from '@n8d/htwoo-react/HOODialog';
import HOODialogHeader from '@n8d/htwoo-react/HOODialogHeader';
import HOODialogContent from '@n8d/htwoo-react/HOODialogContent';
import HOOLabel from '@n8d/htwoo-react/HOOLabel';

export default class CodeOnceUseEverywhereDemo extends React.Component<ICodeOnceUseEverywhereDemoProps, {}> {
  public render(): React.ReactElement<ICodeOnceUseEverywhereDemoProps> {
    return (
      <div className={styles.codeOnceUseEverywhereDemo}>
        <HOOWebPartTitle
          editMode
          placeholder="Web Part Title"
          title="Pipeline"
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
            {this.props.clients.map((c, index) => {
              return (
                <tr key={index}>
                  <td>{c.companyName}</td>
                  <td>{c.contactName}</td>
                  <td>
                    {(c.contactEmail) &&
                      <a href={`mailto:${c.contactEmail}`}>{c.contactEmail}</a>
                    }
                  </td>
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
                      onClick: function noRefCheck() { alert("view") }
                    }}
                  />
                  </td>
                  <td><HOOIcon
                    iconName="icon-edit-regular"
                    iconLabel='Edit'
                    rootElementAttributes={{
                      onClick: function noRefCheck() { alert("edit") }
                    }}
                  /></td>
                  <td><HOOIcon
                    iconName="icon-delete-regular"
                    iconLabel='Delete'
                    rootElementAttributes={{
                      onClick: function noRefCheck() { alert("delete") }
                    }}
                  /></td>
                </tr>
              );
            })}
          </tbody>
        </HOOTable>
        <HOODialog
          height="80vh"
          rootElementAttributes={{
            style: {
              backgroundColor: 'pink'
            }
          }}
          type={0}
          width="80vw" visible={false}        >
          <HOODialogHeader
            closeIconName="hoo-icon-close"
            title="Dialog Header" closeDisabled={false} closeOnClick={function (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
              throw new Error('Function not implemented.');
            }} />
          <HOODialogContent>
            <HOOLabel label="Content of Dialog" />
          </HOODialogContent>
        </HOODialog>
      </div>
    );
  }
}
