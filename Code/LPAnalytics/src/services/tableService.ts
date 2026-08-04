import { IAppInsightUtil, MessageType, SeverityLevel } from '../common/appinsightutil.js';
import { IAuthService } from '../common/auth.js';
import { ILPAnalyticsEvent } from "../models/analyticsModels.js";
import { ASSET_PARTITION_KEY, IAssetTableEntity, IAnalyticsTableEntity } from "../models/tableModels.js";
import { randomUUID } from "node:crypto";

export interface ITableService {
  Process(queueItem: ILPAnalyticsEvent): Promise<boolean>;
}

export class TableService implements ITableService {
  private LOG_SOURCE = "TableService";
  private _apu: IAppInsightUtil;
  private _auth: IAuthService;

  constructor(apu: IAppInsightUtil, auth: IAuthService) {
    this._apu = apu;
    this._auth = auth;
  }

  public async Process(queueItem: ILPAnalyticsEvent): Promise<boolean> {
    try {
      const assetOk = await this._upsertAsset(queueItem);
      const analyticsOk = await this._insertAnalyticsEvent(queueItem);
      return assetOk && analyticsOk;
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
      return false;
    }
  }

  private async _upsertAsset(queueItem: ILPAnalyticsEvent): Promise<boolean> {
    try {
      const client = this._auth.assetTableClient;
      const entity: IAssetTableEntity = {
        ...queueItem.asset,
        partitionKey: ASSET_PARTITION_KEY,
        rowKey: queueItem.asset.Id
      };
      await client.createEntity(entity);
      return true;
    } catch (err) {
      if (err?.statusCode === 409) {
        this._apu.Log(MessageType.Trace, {
          message: `Asset ${queueItem.asset.Id} already exists, skipping insert`,
          logSource: this.LOG_SOURCE,
          severity: SeverityLevel.Verbose,
          properties: { method: "_upsertAsset", assetId: queueItem.asset.Id }
        });
        return true;
      }
      this._apu.Log(MessageType.Exception, {
        logSource: this.LOG_SOURCE,
        exception: err,
        severity: SeverityLevel.Critical,
        properties: { method: "_upsertAsset", assetId: queueItem.asset.Id }
      });
      return false;
    }
  }

  private async _insertAnalyticsEvent(queueItem: ILPAnalyticsEvent): Promise<boolean> {
    try {
      const client = this._auth.analyticsTableClient;
      const now = new Date();
      const entity: IAnalyticsTableEntity = {
        partitionKey: now.toISOString().slice(0, 10).replace(/-/g, ""),
        rowKey: `${now.toISOString()}_${randomUUID()}`,
        user: queueItem.user,
        webpart_ver: queueItem.webpart_ver,
        language: queueItem.language,
        eventType: queueItem.eventType,
        eventTime: now.toISOString(),
        pageUrl: queueItem.pageUrl,
        playlistId: queueItem.playlistId,
        playlistName: queueItem.playlistName,
        tenantGuid: queueItem.tenant._guid,
        assetPartitionKey: ASSET_PARTITION_KEY,
        assetRowKey: queueItem.asset.Id
      };
      await client.createEntity(entity);
      return true;
    } catch (err) {
      this._apu.Log(MessageType.Exception, {
        logSource: this.LOG_SOURCE,
        exception: err,
        severity: SeverityLevel.Critical,
        properties: {
          method: "_insertAnalyticsEvent",
          projectNotification: JSON.stringify(queueItem)
        }
      });
      return false;
    }
  }
}
