"use strict";
// do not forget to register the webhook
// curl -F "url=https://vast-fortress-52095.herokuapp.com" https://api.telegram.org/bot{bot token}/setWebhook
// app now needs env variable with token
// heroku config:set BOT_TOKEN={bot token}
exports.__esModule = true;
var http = require("http");
var api_telegram_bot_1 = require("api-telegram-bot");
var bot = new api_telegram_bot_1.TelegramBotClient(process.env.BOT_TOKEN);
var webhook = new api_telegram_bot_1.Webhook(bot);
var cryptoWords = ["ETH", "BTC", "ether", "ethereum", "bitcoin"];
function getMatch(words, sentence) {
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (sentence.toLowerCase().split(word.toLowerCase()) >= 0) {
            console.log("found word "+word);
            return word;
        } else {
            console.log("no match in: "+sentence);
        }
    }
    return null;
}
/*
 * actions is an object with some shortcuts to manipulate received message:
 *    banChatMember?: (until: number) => Promise<TelegramResponse<boolean>>
 *    deleteMessage?: () => Promise<TelegramResponse<boolean>>;
 *    reply: (text: string, optionals?) => Promise<TelegramResponse<Message>>;
 *
 * deleteMessage and banChatMember are not provided if message was received on private chats
 */
webhook.on("text", function (message, actions) {
    var word = getMatch(cryptoWords, message.text);
    if (word != null) {
        actions.reply(word + "? Is that still used? I must have travelled way too far back in time...");
    }
});
// NOTE: message actions are provided only for regex callbacks and subtypes of message events
webhook.on("edited_message", function (message) {
    // message actions not provided here
});
http.createServer(webhook.getWebhook())
    .listen(process.env.PORT || 3000, function () { return console.log("listening"); });
