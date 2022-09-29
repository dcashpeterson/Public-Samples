import * as React from 'react';
import styles from './IntroToTeamsDevDemo1.module.scss';
import { IIntroToTeamsDevDemo1Props } from './IIntroToTeamsDevDemo1Props';
import { CONFIG_TYPE } from '../IntroToTeamsDevDemo1WebPart';

export default class IntroToTeamsDevDemo1 extends React.Component<IIntroToTeamsDevDemo1Props, {}> {
  public render(): React.ReactElement<IIntroToTeamsDevDemo1Props> {
    let title: string = '';
    let subTitle: string = '';
    let siteTabTitle: string = '';

    if (this.props.configType === CONFIG_TYPE.Team) {
      // We have teams context for the web part
      title = "Welcome to Teams!";
      subTitle = "Building custom enterprise tabs for your business.";
      siteTabTitle = "We are in the context of following Team: " + this.props.context.teamName;
    }
    else if (this.props.configType === CONFIG_TYPE.Personal) {
      // We have teams context for the personal web part
      title = "Welcome to Teams Personal Apps!";
      subTitle = "I am a personal app.";
    }
    else {
      // We are rendered in normal SharePoint context
      title = "Welcome to SharePoint!";
      subTitle = "Customize SharePoint experiences using Web Parts.";
      siteTabTitle = "We are in the context of following site: " + this.props.context.web.title;
    }

    return (
      <div className={styles.introToTeamsDevDemo1}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>{title}</span>
              <p className={styles.subTitle}>{subTitle}</p>
              <p className={styles.description}>{siteTabTitle}</p>
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
