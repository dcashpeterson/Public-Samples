"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationApp = void 0;
const teamsfx_1 = require("@microsoft/teamsfx");
var ConversationBot = teamsfx_1.BotBuilderCloudAdapter.ConversationBot;
const config_1 = __importDefault(require("./config"));
// Create bot.
exports.notificationApp = new ConversationBot({
    // The bot id and password to create CloudAdapter.
    // See https://aka.ms/about-bot-adapter to learn more about adapters.
    adapterConfig: {
        MicrosoftAppId: config_1.default.botId,
        MicrosoftAppPassword: config_1.default.botPassword,
        MicrosoftAppType: "MultiTenant",
    },
    // Enable notification
    notification: {
        enabled: true
    },
});
//# sourceMappingURL=initialize.js.map