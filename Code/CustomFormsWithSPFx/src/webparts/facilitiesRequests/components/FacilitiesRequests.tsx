import HOOButton from '@n8d/htwoo-react/HOOButton';
import HOODialog from '@n8d/htwoo-react/HOODialog';
import HOODialogContent from '@n8d/htwoo-react/HOODialogContent';
import HOODialogHeader from '@n8d/htwoo-react/HOODialogHeader';
import HOOPivotBar, { IHOOPivotItem } from '@n8d/htwoo-react/HOOPivotBar';
import HOOTable from '@n8d/htwoo-react/HOOTable';
import * as strings from 'FacilitiesRequestsWebPartStrings';
import * as React from 'react';
import { IFacilitiesRequestItem } from '../../../common/models/models';
import { formsService } from '../../../common/services/formsService';
import styles from './FacilitiesRequests.module.scss';
import type { IFacilitiesRequestsProps } from './IFacilitiesRequestsProps';

export interface IVacationRequestProps {

}

export interface IFacilitiesRequestState {
  currentMenuKey: number;
  dialogVisible: boolean;
  selectedItemId: number;
  modeId: number;
}

export class FacilitiesRequestState implements IFacilitiesRequestState {
  constructor(
    public currentMenuKey: number = 0,
    public dialogVisible: boolean = false,
    public selectedItemId: number = 0,
    public modeId: number = 0
  ) { }
}

export default class FacilitiesRequests extends React.Component<IFacilitiesRequestsProps, IFacilitiesRequestState> {
  private LOG_SOURCE: string = "🏳️‍🌈 FacilitiesRequestWebPart";

  constructor(props: IFacilitiesRequestsProps) {
    super(props);
    this.state = new FacilitiesRequestState();
  }

  private _getPivotItems = (): IHOOPivotItem[] => {
    const retVal: IHOOPivotItem[] = [];
    try {
      strings.issuesMenuValues.map((item, index) => {
        retVal.push({
          text: item,
          key: index
        });
      });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_getPivotItems) - ${err}`);
    }
    return retVal;
  }

  private _toggleMenuState = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, key: number): void => {
    try {
      this.setState({ currentMenuKey: key });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_toggleMenuState) - ${err}`);
    }
  }

  private _toggleDialog = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>, mode?: number, id?: number): void => {
    try {
      this.setState({ dialogVisible: !this.state.dialogVisible, modeId: mode ?? 0, selectedItemId: id ?? 0 });
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_toggleMenuState) - ${err}`);
    }
  }
  private _setFrameHeight(): void {
    let retVal: number = 500;
    try {
      var iframe = document.getElementById('formViewer') as HTMLIFrameElement;
      var iframeDoc = iframe.contentDocument || (iframe.contentWindow ? iframe.contentWindow.document : null);
      retVal = iframeDoc ? iframeDoc.body.scrollHeight : 0;
      iframe.height = `${retVal}px`;
    } catch (err) {
      console.error(`${this.LOG_SOURCE} (_getFormHeight) - ${err}`);
    }
  }

  public render(): React.ReactElement<IFacilitiesRequestsProps> {
    let reports: IFacilitiesRequestItem[] = [];
    if (this.state.currentMenuKey === 0) {
      reports = formsService.ItemsReportedByMe;
    } else if (this.state.currentMenuKey === 1) {
      reports = formsService.ItemsWaitingVerification;
    } else if (this.state.currentMenuKey === 2) {
      reports = formsService.ItemsAssignedToMe;
    }

    return (
      <div data-component={this.LOG_SOURCE} className={styles.facilitiesRequests}>
        <HOOPivotBar
          onClick={this._toggleMenuState}
          pivotItems={this._getPivotItems()}
          selectedKey={this.state.currentMenuKey}
        />
        {(reports.length > 0) &&
          <HOOTable tableStyle={1}>
            <thead>
              <tr>
                <th>
                  Issue Type
                </th>
                <th>
                  Severify
                </th>
                <th>
                  Issue Status
                </th>
                {(this.state.currentMenuKey === 0) &&
                  <>
                    <th>
                      Date Modifed
                    </th>
                    <th>
                      Modified by
                    </th>
                    <th>
                      Assigned To
                    </th>
                  </>
                }
                {(this.state.currentMenuKey !== 0) &&
                  <>
                    <th>
                      Reported By
                    </th>
                    <th>
                      Reported Date
                    </th>
                  </>
                }
                {(this.state.currentMenuKey === 2) &&
                  <th>
                    Verfication Date
                  </th>
                }
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {reports.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {item.issueType}
                    </td>
                    <td>
                      {item.severity}
                    </td>
                    <td>
                      {item.requestStatus}
                    </td>

                    {(this.state.currentMenuKey === 0) &&
                      <>
                        <td>
                          {item.modifiedDate.toLocaleDateString()}
                        </td>
                        <td>
                          {item.modifiedBy.displayName}
                        </td>
                        <td>
                          {(item.assignee?.displayName !== "") ? item.assignee?.displayName : "Waiting for assignment"}
                        </td>
                      </>
                    }
                    {(this.state.currentMenuKey !== 0) &&
                      <>
                        <td>
                          {(item.reportedBy?.displayName !== "") ? item.reportedBy?.displayName : ""}
                        </td>
                        <td>
                          {item.reportedDate.toLocaleDateString()}
                        </td>
                      </>
                    }
                    {(this.state.currentMenuKey === 2) &&
                      <td>
                        {item.verificationDate.toLocaleDateString()}
                      </td>
                    }
                    <td><HOOButton
                      iconName="icon-edit-regular"
                      onClick={(e) => { this._toggleDialog(e, 6, item.id) }}
                      type={0} />
                    </td>
                    <td><HOOButton
                      iconName="icon-document-regular"
                      onClick={(e) => { this._toggleDialog(e, 4, item.id) }}
                      type={0} />
                    </td>
                  </tr>
                )
              })
              }
            </tbody>
          </HOOTable>
        }
        <HOODialog
          changeVisibility={function noRefCheck() { }}
          height="60vh"
          type={9}
          width="60vw" visible={this.state.dialogVisible}>
          <HOODialogHeader
            closeIconName="hoo-icon-close"
            closeOnClick={(e) => { this._toggleDialog(e) }}
            title="Facilities Request" closeDisabled={false} />
          <HOODialogContent>
            <iframe id='formViewer' className='hoo-dlg-iframe' src={`${formsService.SiteURL}/_layouts/15/SPListForm.aspx?PageType=${this.state.modeId}&List=${formsService.ListID}${(this.state.modeId !== 8) ? '&ID=' + this.state.selectedItemId : ''}&ContentTypeId=${formsService.ContentTypeID}`} onLoad={this._setFrameHeight} />

          </HOODialogContent>
        </HOODialog>
      </div>
    );
  }
}
