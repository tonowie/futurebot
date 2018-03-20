"use strict";
exports.__esModule = true;
var http = require("http");
var api_telegram_bot_1 = require("api-telegram-bot");
var TOKEN = "BOT_TOKEN";
var bot = new api_telegram_bot_1.TelegramBotClient(TOKEN);
var webhook = new api_telegram_bot_1.Webhook(bot);
/*
 * actions is an object with some shortcuts to manipulate received message:
 *    banChatMember?: (until: number) => Promise<TelegramResponse<boolean>>
 *    deleteMessage?: () => Promise<TelegramResponse<boolean>>;
 *    reply: (text: string, optionals?) => Promise<TelegramResponse<Message>>;
 *
 * deleteMessage and banChatMember are not provided if message was received on private chats
 */
webhook.on("text", function (message, actions) {
    actions.reply("You send: " + message.text);
});
// NOTE: message actions are provided only for regex callbacks and subtypes of message events
webhook.on("edited_message", function (message) {
    // message actions not provided here
});
http.createServer(webhook.getWebhook())
    .listen(3000, function () { return console.log("listening"); });
