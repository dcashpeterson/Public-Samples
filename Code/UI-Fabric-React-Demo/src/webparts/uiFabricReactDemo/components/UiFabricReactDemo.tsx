import * as React from 'react';
import styles from './UiFabricReactDemo.module.scss';
import { IUiFabricReactDemoProps } from './IUiFabricReactDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Opportunity } from '../models/IOpportunity';
import { Logger, ConsoleListener, LogLevel } from '@pnp/logging';
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

export interface IUiFabricReactDemoState {
  opportunities: Opportunity[];
  items: IDetailsListBasicExampleItem[];
  selectionDetails: string;
}

export class UiFabricReactDemoState implements IUiFabricReactDemoState {
  constructor(
    public opportunities: Opportunity[] = [],
    public items: IDetailsListBasicExampleItem[] = [],
    public selectionDetails: string = ""
  ) { }
}

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px'
});

export interface IDetailsListBasicExampleItem {
  key: number;
  name: string;
  value: number;
}

export default class UiFabricReactDemo extends React.Component<IUiFabricReactDemoProps, IUiFabricReactDemoState, {}> {
  private _selection: Selection;
  private _allItems: IDetailsListBasicExampleItem[];
  private _columns: IColumn[];

  constructor(props: IUiFabricReactDemoProps) {
    super(props);

    this.state = new UiFabricReactDemoState(
      this.props.opportunities,
      this._allItems,
      this._getSelectionDetails()
    );

    this._convertOpportunities(this.state.opportunities);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() })
    });

    // Populate with items for demos.
    this._allItems = [];
    for (let i = 0; i < this.state.opportunities.length; i++) {
      this._allItems.push({
        key: i,
        name: this.state.opportunities[i].projectTitle,
        value: i
      });
    }

    this.setState({ items: this._allItems });

    this._columns = [
      { key: 'column1', name: 'Client', onRender: (item?: any, index?: number, column?: IColumn) => item.client.name, minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'Project Title', fieldName: 'projectTitle', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column3', name: 'Description', fieldName: 'projectDescription', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column4', name: 'Engagement Manager', fieldName: 'engagementManager', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column5', name: 'Status', fieldName: 'status', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column6', name: 'Last Contact', onRender: (item?: any, index?: number, column?: IColumn) => item.lastContactDate.toDateString(), minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column7', name: 'Next Contact', onRender: (item?: any, index?: number, column?: IColumn) => item.nextContactDate.toDateString(), minWidth: 100, maxWidth: 200, isResizable: true }
    ];

  }

  private _convertOpportunities(opportunities: Opportunity[]) {
    let values: IDetailsListBasicExampleItem[] = [];
    for (let i = 0; i < this.state.opportunities.length; i++) {
      values.push({
        key: i,
        name: this.state.opportunities[i].projectTitle,
        value: i
      });
    }

    this.setState({ items: values });

  }

  private async _onInit(): Promise<void> {
    //Initialize PnPLogger
    Logger.subscribe(new ConsoleListener());
    Logger.activeLogLevel = LogLevel.Info;

  }

  private _getSelectionDetails(): string {
    //const selectionCount = this._selection.getSelectedCount.length;

    //switch (selectionCount) {
    //  case 0:
    //    return 'No items selected';
    //  case 1:
    //    return '1 item selected: ' + (this._selection.getSelection()[0] as IDetailsListBasicExampleItem).name;
    //  default:
    return ""; // `${selectionCount} items selected`;
    //}
  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
    this.setState({
      items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems
    });
  }

  private _onItemInvoked = (item: IDetailsListBasicExampleItem): void => {
    alert(`Item invoked: ${item.name}`);
  }

  public render(): React.ReactElement<IUiFabricReactDemoProps> {
    return (
      <div className={styles.uiFabricPipelineFabricReactThemesDemo}>
        <h2>Pipeline</h2>
        <Fabric>
          <div className={exampleChildClass}>{this.state.selectionDetails}</div>
          <Announced message={this.state.selectionDetails} />
          <TextField
            className={exampleChildClass}
            label="Filter by name:"
            onChange={this._onFilter}
            styles={{ root: { maxWidth: '300px' } }}
          />
          <Announced message={`Number of items after filter applied: ${this.state.items.length}.`} />
          <MarqueeSelection selection={this._selection}>
            <DetailsList
              items={this.state.opportunities}
              columns={this._columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={this._selection}
              selectionPreservedOnEmptyClick={true}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="Row checkbox"
              onItemInvoked={this._onItemInvoked}
            />
          </MarqueeSelection>
        </Fabric>
      </div >
    );
  }
}
