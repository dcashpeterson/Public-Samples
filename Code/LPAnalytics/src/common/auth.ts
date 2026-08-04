import { DefaultAzureCredential } from "@azure/identity";
import { TableClient } from "@azure/data-tables";
import { AzureIdentity } from "@pnp/azidjsclient";
import { GraphDefault, SPDefault } from "@pnp/nodejs";
import { spfi, SPFI } from "@pnp/sp";
import { graphfi, GraphFI } from '@pnp/graph';
import { IAppInsightUtil, MessageType, SeverityLevel } from "./appinsightutil.js";

export interface IAuthService {
  readonly ready: boolean;
  readonly sp: SPFI;
  readonly graph: GraphFI;
  readonly spAdmin: SPFI;
  readonly assetTableClient: TableClient;
  readonly analyticsTableClient: TableClient;
  Init: () => Promise<boolean>;
}

export class AuthService implements IAuthService {
  private LOG_SOURCE = "🟢AuthService";
  private _ready: boolean = false;
  private _sp: SPFI = null;
  private _graph: GraphFI = null;
  private _spAdmin: SPFI = null;
  private _assetTableClient: TableClient = null;
  private _analyticsTableClient: TableClient = null;
  private _apu: IAppInsightUtil = null;
  private _credential: DefaultAzureCredential = null;

  public constructor(apu: IAppInsightUtil) { 
    this._apu = apu;
  }

  public async Init(): Promise<boolean> {
    let retVal = false;
    try {
      const credential = new DefaultAzureCredential();
      this._credential = credential;
      this._sp = spfi(process.env.AnalyticsSite).using(SPDefault(),
        AzureIdentity(credential, [`https://${process.env.Tenant}.sharepoint.com/.default`], null));
      this._graph = graphfi().using(GraphDefault(), AzureIdentity(credential, [`https://graph.microsoft.com/.default`], null));
      const tenantUrl = `https://${process.env.Tenant}-admin.sharepoint.com`;
      this._spAdmin = spfi(tenantUrl).using(SPDefault(),
      AzureIdentity(credential, [`https://${process.env.Tenant}-admin.sharepoint.com/.default`], null));
      this._assetTableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.AssetTableName, this._credential);
      this._analyticsTableClient = new TableClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.table.core.windows.net`, process.env.AnalyticsTableName, this._credential);
      this._ready = true;
      this._apu.Log(MessageType.Trace, {
        message: "Init success",
        logSource: this.LOG_SOURCE,
        properties: {
          method: "Init"
        },
        severity: SeverityLevel.Verbose
      });     
      retVal = true;
    } catch (err) {
      this._apu.Log(MessageType.Exception, {
        logSource: this.LOG_SOURCE,
        exception: err,
        severity: SeverityLevel.Critical,
        properties: {
          method: "Init"
        }
      });
    }
    return retVal;
  }

  public get ready(): boolean {
    return this._ready;
  }
  public get sp(): SPFI {
    return this._sp;
  }
  public get graph(): GraphFI {
    return this._graph;
  }

  public get spAdmin(): SPFI {
    return this._spAdmin
  }

  public get assetTableClient(): TableClient {
    return this._assetTableClient
  }

  public get analyticsTableClient(): TableClient {
    return this._analyticsTableClient
  }
}