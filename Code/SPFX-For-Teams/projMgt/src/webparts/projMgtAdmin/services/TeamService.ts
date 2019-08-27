import { Logger, LogLevel } from "@pnp/logging";
import * as lodash from "lodash";
import "@pnp/polyfill-ie11";
import { Team, Group} from "../models/Models";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClient } from '@microsoft/sp-http';

export interface ITeamService {
  context: WebPartContext;
  getGroup(groupId: string): Promise<Group>;
  createGroup(title: string): Promise<Group>;
  createChannel(teamID: string, title: string): Promise<Group>;
}

export class TeamService implements ITeamService {
  public context: WebPartContext;
  
  private LOG_SOURCE = "TeamService";
  
  private fieldOptions = {
    headers: { Accept: "application/json;odata.metadata=none" }
  };

  constructor(context: WebPartContext) {
    this.context = context;
  }

  //Get the planners for a group
  public async getGroup(groupId: string) {
    var result = new Promise<Group>((resolve, reject) => {
        this.context.msGraphClientFactory
            .getClient()
            .then((graphClient: MSGraphClient): void => {
                graphClient.api(`https://graph.microsoft.com/v1.0/groups/${groupId}`)
                    .get((error, data: any, rawResponse?: any) => {
                        let group: Group = new Group();
                        group.id = data.value.id;
                        group.title = data.value.displayName;
                        resolve(group);
                    });
            });
    });
    return result;
  }
  //Get the planners for a group
  public async createGroup(title: string) {
    let result = new Promise<Group>((resolve, reject) => {
        let group: any = {
            id: this.createGuid(),
            displayName: title,
            mailEnabled:true,
            mailNickname: title,
            securityEnabled:true,
            owners: 'derek@derekcp.onmicrosoft.com',
            members: 'derek@derekcp.onmicrosoft.com'
        };

        this.context.msGraphClientFactory
        .getClient()
        .then((graphClient: MSGraphClient): void => {
            graphClient.api(`https://graph.microsoft.com/v1.0/groups`)
            .post(group, ((err, res) => {
                let createdGroup: Group = {
                    id: res.id,
                    title: res.displayName
                };
                resolve(createdGroup);
            }));
        });
    });
    return result;
  }

  //Create a new Channel
  public async createChannel(teamID: string, title: string) {
    let result = new Promise<Group>((resolve, reject) => {
        let channel: any = {
            displayName: title,
            description: 'Client Channel'
        };

        this.context.msGraphClientFactory
        .getClient()
        .then((graphClient: MSGraphClient): void => {
            graphClient.api(`https://graph.microsoft.com/v1.0/teams/${teamID}/channels`)
            .post(channel, ((err, res) => {
                let createdChannel: Group = {
                    id: res.id,
                    title: res.displayName
                };
                resolve(createdChannel);
            }));
        });
    });
    return result;
  }





  private createGuid(): string{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r & 0x3 | 0x8 );
        return v.toString(16);
    });
  }

}