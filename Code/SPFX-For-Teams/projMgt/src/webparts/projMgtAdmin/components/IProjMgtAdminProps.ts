import { IClient, Client } from "../models/Models";
import { Web } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as microsoftTeams from '@microsoft/teams-js';

export interface IProjMgtAdminProps {
  adminSiteCollection: string;
  adminListName: string;
  clients: Client[];
  teamsContext: microsoftTeams.Context;
  spContext:  WebPartContext;
}
