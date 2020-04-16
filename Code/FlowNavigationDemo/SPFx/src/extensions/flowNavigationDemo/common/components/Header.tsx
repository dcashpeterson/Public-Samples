import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import ILink from '../model/ILink';

import styles from './HeaderFooter.module.scss';

export interface IHeaderProps {
  links: ILink[];
}

export class Header extends React.Component<IHeaderProps, {}> {

  constructor(props: IHeaderProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={styles.topNav}>
        {/* Render hamburger menu */}
        <input type="checkbox" id="show-menu" role="button" />
        <label htmlFor="show-menu" className={styles["show-menu"]}>
          <div className={styles["show-menu"]}><div className={styles.hamburger}>
            Menu<FontIcon iconName="TriangleSolidDown12" className={styles.closed} /><FontIcon iconName="TriangleSolidUp12" className={styles.open} />
          </div></div>
        </label>

        {/* Render the main menu */}
        <ul>
          {this.props.links.map(l => (
            <li>
              <a href={l.url}>{l.name}</a>
              {/* Render a child menu */}
              <ul className={styles.hidden}>
                {l.children ? l.children.map(m => (
                  <li>
                    <a href={m.url}>{m.name}</a>
                  </li>
                )) : null}
              </ul>
              {/* End child menu */}
            </li>
          ))}
        </ul>
        {/* End main menu */}
      </div>
    );
  }
}