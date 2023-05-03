import * as React from 'react';
import styles from './CodeOnceUseEverywhereDemo.module.scss';
import { ICodeOnceUseEverywhereDemoProps } from './ICodeOnceUseEverywhereDemoProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import HOOTable, { HOOTableStyle } from '@n8d/htwoo-react/HOOTable';
import { Environment } from '../../../models/models';

export default class CodeOnceUseEverywhereDemo extends React.Component<ICodeOnceUseEverywhereDemoProps, {}> {
  public render(): React.ReactElement<ICodeOnceUseEverywhereDemoProps> {
    return (
      <div className={styles.codeOnceUseEverywhereDemo}>
        <HOOTable tableStyle={HOOTableStyle.Normal}>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Job Title</th>
              <th>Email</th>
              <th>Company</th>
              {(this.props.environment !== Environment.PERSONALAPP) &&
                <th>Sales Lead</th>
              }
            </tr>
          </thead>
          <tbody>
            {this.props.clients.map((c, index) => {
              return (
                <tr key={index}>
                  <td>{c.title}</td>
                  <td>{c.jobtitle}</td>
                  <td>{c.email}</td>
                  <td>{c.company}</td>
                  {(this.props.environment !== Environment.PERSONALAPP) &&
                    <th>{c.salesleadname}</th>
                  }
                </tr>
              );
            })}
          </tbody>
        </HOOTable>

      </div>
    );
  }
}
