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
var cryptoWords = ["ETH", "BTC", "ether", "ethereum", "bitcoin", "Ripple"];
var answers = ["Is that still used? I must have travelled way too far back in time...",
    "I think I remember that from history classes.",
    "That was nice project back in the old days...",
    "That's something Wright brothers used, isn't it?",
    "People are still using that? Interesting."
];
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}
function getMatch(words, sentence) {
    sentence = sentence.toLowerCase();
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (sentence.indexOf(word.toLowerCase()) >= 0) {
            return word;
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
        actions.reply("Did you mention " + word + "? " + answers[getRandomInt(0, answers.length)]);
    }
});
// NOTE: message actions are provided only for regex callbacks and subtypes of message events
webhook.on("edited_message", function (message) {
    // message actions not provided here
});
http.createServer(webhook.getWebhook())
    .listen(process.env.PORT || 3000, function () { return console.log("listening"); });
