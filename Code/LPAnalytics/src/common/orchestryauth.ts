import { AccessToken, ClientSecretCredential } from "@azure/identity";
import { PnPClientStorage, getHashCode } from "@pnp/core/index.js";
import { IAppInsightUtil, MessageType, SeverityLevel } from './appinsightutil.js';

export interface IAzureIdentityToken {
  token: string;
  expires: Date;
}

export interface IOrchestryAuthService {
  GetToken: () => Promise<string>;
}

export class OrchestryAuthService implements IOrchestryAuthService {
  private LOG_SOURCE = "OrchestryAuthService";
  private _storage = null;
  private _credential = new ClientSecretCredential(process.env.OrchestryTenantId, process.env.OrchestryClientId, process.env.OrchestryClientSecret);
  private _key = null;
  private _apu = null;

  constructor(apu: IAppInsightUtil) {
    this._apu = apu;
  }

  public async GetToken(): Promise<string> {
    this._storage = new PnPClientStorage();
    this._key = `AzureIdentityCredential${Math.abs(getHashCode(process.env.OrchestryScope))}`;
    let token: string = null;
    let expires: Date = null;
    try {
      const tokenStore = this._storage.session.get(this._key);
      if (tokenStore) {
        const storedToken: IAzureIdentityToken = JSON.parse(tokenStore);
        if (new Date(storedToken.expires) > (new Date())) {
          token = storedToken.token;
        }
      }
      if (token == null) {
        const aiToken: AccessToken = await this._credential.getToken([process.env.OrchestryScope]);
        // Set expiration date equal to the expiration timestamp minus 5 minutes for buffer
        expires = new Date((new Date()).getMilliseconds() + (aiToken.expiresOnTimestamp - 300000));
        token = aiToken.token;
        const newToken: IAzureIdentityToken = { token, expires };
        this._storage.session.put(this._key, JSON.stringify(newToken));
      }
    } catch (err) {
      this._apu.Log(MessageType.Exception, {
        logSource: this.LOG_SOURCE,
        exception: err,
        severity: SeverityLevel.Critical,
        properties: {
          method: "GetToken"
        }
      });
    }

    return token;
  }
}