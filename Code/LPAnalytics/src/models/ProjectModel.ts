import { IWebInfo } from "@pnp/sp/webs";

export interface IProjectVersion {
  Id: number;
};

export interface IHyperlink {
  Url: string;
  Description: string;
}

export interface IProject {
  Id: number;
  Title: string;
  ProjectStatus: string;
  ProjectSubStatus: string;
  ProjectSiteUrl: string;
  ProjectSite: IHyperlink;
  Web: IWebInfo;
  SiteId: string;
  GroupId: string;
  HubId: string;
  SiteIcon: string;
  SiteLogo: string;
  Success: boolean;
}

export enum SiteLockedStates {
  Unlock = "Unlock",
  ReadOnly = "ReadOnly",
  NoAccess = "NoAccess"
}

export interface INewMenuItem {
  contentTypeId: string;
  isContentType: boolean;
  templateId: string;
  title: string;
  visible: boolean;
}

export interface IResourceComplete {
  "@odata.context": string;
  "@microsoft.graph.tips": string;
  id: string;
  createdDateTime: string;
  resourceId: string;
  resourceLocation: string;
  status: string; //"succeeded",
  type: string;
}