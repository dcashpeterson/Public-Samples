import { TableEntity } from "@azure/data-tables";
import { ILPAnalyticsAsset, ILPAnalyticsEvent } from "./analyticsModels.js";

export const ASSET_PARTITION_KEY = "Asset";

// ILPAnalyticsAsset is already flat, so it's reused as-is for the asset table's properties.
export type IAssetTableEntity = TableEntity<ILPAnalyticsAsset>;

// ILPAnalyticsEvent can't be reused as-is: `tenant` and `asset` are nested objects, and
// Table Storage properties must be primitives. Reuse everything else via Omit, and only
// declare the fields that replace/extend those two.
export interface IAnalyticsEntityProperties extends Omit<ILPAnalyticsEvent, "tenant" | "asset"> {
  eventTime: string;
  tenantGuid: string;
  assetPartitionKey: string;
  assetRowKey: string;
}
export type IAnalyticsTableEntity = TableEntity<IAnalyticsEntityProperties>;
