export interface ILPAnalyticsTenant {
  _guid: string;
}

export interface ILPAnalyticsAsset {
  Id: string;
  Title: string;
  Description: string;
  Url: string;
  TechnologyId: string;
  SubjectId: string;
  Source: string;
  StatusTagId: string;
  StatusNote: string;
}

export interface ILPAnalyticsEvent {
  user: string;
  tenant: ILPAnalyticsTenant;
  webpart_ver: string;
  language: string;
  eventType: string;
  pageUrl: string;
  playlistId: string;
  playlistName: string;
  asset: ILPAnalyticsAsset;
}