import { Client, Environment } from "../../../models/models";

export interface ICodeOnceUseEverywhereDemoProps {
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  userDisplayName: string;
  clients: Client[];
  environment: Environment;
}
