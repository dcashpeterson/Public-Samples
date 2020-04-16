import * as React from 'react';
import styles from './HelloWorldForTeams.module.scss';
import { IHelloWorldForTeamsProps } from './IHelloWorldForTeamsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class HelloWorldForTeams extends React.Component<IHelloWorldForTeamsProps, {}> {
  public render(): React.ReactElement<IHelloWorldForTeamsProps> {
    let title: string = '';
    let subTitle: string = '';
    let siteTabTitle: string = '';

    if (this.props.context.sdks.microsoftTeams) {
      // We have teams context for the web part
      title = "Welcome to Teams!";
      subTitle = "Building custom enterprise tabs for your business.";
      siteTabTitle = "We are in the context of following Team: " + this.props.context.sdks.microsoftTeams.context.teamName;
    }
    else {
      // We are rendered in normal SharePoint context
      title = "Welcome to SharePoint!";
      subTitle = "Customize SharePoint experiences using Web Parts.";
      siteTabTitle = "We are in the context of following site: " + this.props.context.pageContext.web.title;
    }

    return (
      <div className={styles.helloWorldForTeams}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <p className="${ styles.subTitle }">{subTitle}</p>
              <p className="${ styles.description }">{siteTabTitle}</p>
              <p className="${ styles.description }">Description property value - {escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
