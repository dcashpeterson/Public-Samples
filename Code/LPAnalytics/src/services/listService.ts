import "@pnp/sp/sites/index.js";
import "@pnp/sp/webs/index.js";
import "@pnp/sp/lists/index.js";
import "@pnp/sp/items/index.js";
import { AssignFrom } from "@pnp/core/index.js";
import { createChangeToken, IChangeQuery, spfi } from "@pnp/sp/index.js";
import { IAppInsightUtil, MessageType, SeverityLevel } from '../common/appinsightutil.js';
import { IAuthService } from '../common/auth.js';
import { ILPAnalyticsEvent } from "../models/analyticsModels";


export interface IListService {
  Process(queueITem: ILPAnalyticsEvent): Promise<boolean>;
}

export class ListService implements IListService {
  private LOG_SOURCE = "ListService";
  private _apu: IAppInsightUtil;
  private _auth: IAuthService;

  constructor(apu: IAppInsightUtil, auth: IAuthService) {
    this._apu = apu;
    this._auth = auth;
  }

  public async Process(queueItem: ILPAnalyticsEvent): Promise<boolean> {
    try {
      var retVal = false;
      const spSite = spfi("https://sympdcp.sharepoint.com/sites/LearningPathwaysAnalytics").using(AssignFrom(this._auth.sp.web));
      var _web = spSite.web;
      var list = await _web.lists.getByTitle(process.env.ListName)();
      const analyticsSite = spfi("https://sympdcp.sharepoint.com/sites/LearningPathwaysAnalytics").using(AssignFrom(this._auth.sp.web));
      const analyticsWeb = analyticsSite.web;
      const analyticsList = await analyticsWeb.lists.getByTitle(process.env.ListName)();
      await analyticsList.items.add({
        Title: queueItem.user + Date().toString(),
        User1: queueItem.user,
        Tenant: queueItem.tenant._guid,
        WebPartVersion: queueItem.webpart_ver,
        LearningPathwaysLanguage: queueItem.language,
        EventType1: queueItem.eventType,
        EventTime: Date().toString(),
        PageUrl: queueItem.pageUrl,
        PlaylistId: queueItem.playlistId,
        PlaylistName: queueItem.playlistName,
        AssetId: queueItem.asset.Id,
        AssetTitle: queueItem.asset.Title,
        AssetDescription: queueItem.asset.Description,
        AssetUrl: queueItem.asset.Url,
        AssetTechnologyId: queueItem.asset.TechnologyId,
        AssetSubjectId: queueItem.asset.SubjectId,
        AssetStatusTagId: queueItem.asset.StatusTagId,
        AssetStatusNote: queueItem.asset.StatusNote
      });
      retVal = true;
    } catch (err) {
        this._apu.Log(MessageType.Exception, {
        logSource: this.LOG_SOURCE,
        exception: err,
        severity: SeverityLevel.Critical,
        properties: {
          method: "Process",
          projectNotification: JSON.stringify(queueItem)
        }
      });
    }
    return retVal;
  }
}
