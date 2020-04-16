import * as React from 'react';
import styles from './UiFabricPipelineDemo.module.scss';
import { IUiFabricPipelineDemoProps } from './IUiFabricPipelineDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Opportunity } from '../models/IOpportunity';
import { Logger, ConsoleListener, LogLevel } from '@pnp/logging';


export interface IUiFabricPipelineDemoState {
  opportunities: Opportunity[];
}
export class UiFabricPipelineDemoState implements IUiFabricPipelineDemoState {
  constructor(
    public opportunities: Opportunity[] = []
  ) { }
}
export default class UiFabricPipelineDemo extends React.Component<IUiFabricPipelineDemoProps, IUiFabricPipelineDemoState, {}> {



  private _writeRow(opportunity: Opportunity, index: number) {
    let row = null;
    let attributes: any[] = [];
    let tabelRowElements: any[] = [];

    //This is the HTML for the Client Name Div
    //ToDo swapt this with opportunity.client
    let titleSpan = React.createElement('span', {}, opportunity.client.name);
    let title = React.createElement('div', { className: styles.column + " " + styles.status }, titleSpan);
    let titleWrapper = React.createElement('div', { className: styles.wrapper + " " + styles["status-owner"] }, title);
    let titleWrapper2 = React.createElement('div', { className: styles.wrapper + " " + styles["status-owner-severity"] }, titleWrapper);

    attributes.push(titleWrapper2);

    //This is the HTML for the Project Title and Description
    let titleDiv = React.createElement('div', { className: styles.column + " " + styles.title }, opportunity.projectTitle);
    let descriptionDiv = React.createElement('div', { className: styles.column + " " + styles.comment }, opportunity.projectDescription);
    let titleArray: any[] = [];
    titleArray.push(titleDiv);
    titleArray.push(descriptionDiv);
    let titleWrapperDiv = React.createElement('div', { className: styles.wrapper + " " + styles["title-comment"] }, titleArray);

    let projectTitle: any[] = [];
    projectTitle.push(titleWrapperDiv);

    let engagementManagerDiv = React.createElement('div', { className: styles.column + " " + styles.module }, opportunity.engagementManager);
    let emWrapperDiv = React.createElement('div', { className: styles.column + " " + styles["module-reporter"] }, engagementManagerDiv);
    projectTitle.push(emWrapperDiv);

    let moduleReporterDiv = React.createElement('div', { className: styles.wrapper + " " + styles["title-comment-module-reporter"] }, projectTitle);
    attributes.push(moduleReporterDiv);

    let attributesDiv = React.createElement('div', { className: styles.wrapper + " " + styles.attributes }, attributes);

    tabelRowElements.push(attributesDiv);

    let statusDiv = React.createElement('div', { className: styles.column + " " + styles.date }, opportunity.status);


    let lastContactDiv = React.createElement('div', { className: styles.column + " " + styles.date }, opportunity.lastContactDate.toLocaleDateString());


    let nextContactDiv = React.createElement('div', { className: styles.column + " " + styles.date }, opportunity.nextContactDate.toLocaleDateString());
    let datesElements: any[] = [];
    datesElements.push(statusDiv);
    datesElements.push(lastContactDiv);
    datesElements.push(nextContactDiv);

    let datesDiv = React.createElement('div', { className: styles.wrapper + " " + styles.dates }, datesElements);
    tabelRowElements.push(datesDiv);

    let editDiv = React.createElement('div', { className: styles.glyphicon }, "edit");
    let editContainerDiv = React.createElement('div', { className: styles.column + " " + styles.watch }, editDiv);
    let editWrapperDiv = React.createElement('div', { className: styles.wrapper + " " + styles.icons }, editContainerDiv);
    tabelRowElements.push(editWrapperDiv);




    row = React.createElement('div', { className: styles.tablerow }, tabelRowElements);

    return row;
  }

  constructor(props: IUiFabricPipelineDemoProps) {
    super(props);
    this.state = new UiFabricPipelineDemoState(
      this.props.opportunities
    );

    this._onInit();

  }
  private async _onInit(): Promise<void> {
    //Initialize PnPLogger
    Logger.subscribe(new ConsoleListener());
    Logger.activeLogLevel = LogLevel.Info;

  }

  public render(): React.ReactElement<IUiFabricPipelineDemoProps> {
    return (
      <div className={styles.uiFabricPipelineDemo}>
        <h2>Pipeline</h2>
        <div className={styles["container-fluid"]}>
          <div className={styles.tablerow + " " + styles.header}>
            <div className={styles.wrapper + " " + styles.attributes}>
              <div className={styles.wrapper + " " + styles["status-owner-severity"]}>
                <div className={styles.wrapper + " " + styles["status-owner"]}>
                  <div className={styles.column + " " + styles.status}><span>Client</span></div>
                </div>
              </div>
              <div className={styles.wrapper + " " + styles["title-comment-module-reporter"]}>
                <div className={styles.wrapper + " " + styles["title-comment"]}>
                  <div className={styles.column + " " + styles.title}>Project Title</div>
                  <div className={styles.column + " " + styles.comment}>Description</div>
                </div>
                <div className="wrapper module-reporter">
                  <div className={styles.column + " " + styles.module}>Engagement Manager</div>
                </div>
              </div>
            </div>

            <div className={styles.wrapper + " " + styles.dates}>
              <div className={styles.column + " " + styles.date}>Status</div>
              <div className={styles.column + " " + styles.date}>Last Contact</div>
              <div className={styles.column + " " + styles.date}>Next Contact</div>
            </div>
            <div className={styles.wrapper + " " + styles.icons}>
              <div title="edit" className={styles.column + " " + styles.watch}>
                <span className="glyphicon glyphicon-eye-open">edit</span>
              </div>
            </div>
          </div>
          {this.state.opportunities.map((l, index) => (
            this._writeRow(l, index)
          ))}

        </div>


      </div >
    );
  }
}
