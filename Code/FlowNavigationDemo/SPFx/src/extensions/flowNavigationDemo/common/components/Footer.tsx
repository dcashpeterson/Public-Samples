import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ILink from '../model/ILink';

import styles from './HeaderFooter.module.scss';

export interface IFooterProps {
  message: string;
  links: ILink[];
}

export class Footer extends React.Component<IFooterProps, {}> {

  constructor(props: IFooterProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={styles.bottomNav}>
        {/* Render the message */}
        <span>{this.props.message}</span>
        {/* Render links */}
        <ul>
          {this.props.links.map(l => (
            <li><a href={l.url}>{l.name}</a></li>
          ))}
        </ul>
        {/* End links */}
      </div>
    );
  }
}