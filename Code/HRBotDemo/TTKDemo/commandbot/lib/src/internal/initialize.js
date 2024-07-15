"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandApp = void 0;
const helloworldCommandHandler_1 = require("../helloworldCommandHandler");
const teamsfx_1 = require("@microsoft/teamsfx");
var ConversationBot = teamsfx_1.BotBuilderCloudAdapter.ConversationBot;
const config_1 = __importDefault(require("./config"));
// Create the command bot and register the command handlers for your app.
// You can also use the commandApp.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor
exports.commandApp = new ConversationBot({
    // The bot id and password to create CloudAdapter.
    // See https://aka.ms/about-bot-adapter to learn more about adapters.
    adapterConfig: {
        MicrosoftAppId: config_1.default.botId,
        MicrosoftAppPassword: config_1.default.botPassword,
        MicrosoftAppType: "MultiTenant",
    },
    command: {
        enabled: true,
        commands: [new helloworldCommandHandler_1.HelloWorldCommandHandler()],
    },
});
//# sourceMappingURL=initialize.js.map