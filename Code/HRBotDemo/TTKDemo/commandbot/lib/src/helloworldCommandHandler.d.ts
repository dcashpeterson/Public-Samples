import { Activity, TurnContext } from "botbuilder";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
/**
 * The `HelloWorldCommandHandler` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export declare class HelloWorldCommandHandler implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns;
    handleCommandReceived(context: TurnContext, message: CommandMessage): Promise<string | Partial<Activity> | void>;
}
