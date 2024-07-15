"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloWorldCommandHandler = void 0;
const botbuilder_1 = require("botbuilder");
const adaptivecards_tools_1 = require("@microsoft/adaptivecards-tools");
const helloworldCommand_json_1 = __importDefault(require("./adaptiveCards/helloworldCommand.json"));
/**
 * The `HelloWorldCommandHandler` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
class HelloWorldCommandHandler {
    constructor() {
        this.triggerPatterns = "helloWorld";
    }
    async handleCommandReceived(context, message) {
        console.log(`App received message: ${message.text}`);
        // Render your adaptive card for reply message
        const cardData = {
            title: "Your Hello World App is Running",
            body: "Congratulations! Your Hello World App is running. Open the documentation below to learn more about how to build applications with the Teams Toolkit.",
        };
        const cardJson = adaptivecards_tools_1.AdaptiveCards.declare(helloworldCommand_json_1.default).render(cardData);
        return botbuilder_1.MessageFactory.attachment(botbuilder_1.CardFactory.adaptiveCard(cardJson));
    }
}
exports.HelloWorldCommandHandler = HelloWorldCommandHandler;
//# sourceMappingURL=helloworldCommandHandler.js.map