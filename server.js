"use strict";
// do not forget to register the webhook
// curl -F "url=https://vast-fortress-52095.herokuapp.com" https://api.telegram.org/bot{bot token}/setWebhook
// app now needs env variable with token
// heroku config:set BOT_TOKEN={bot token}
exports.__esModule = true;
var http = require("http");
var api_telegram_bot_1 = require("api-telegram-bot");
// create and init bot instance
var bot = new api_telegram_bot_1.TelegramBotClient(process.env.BOT_TOKEN);
var webhook = new api_telegram_bot_1.Webhook(bot);
// mock data
var mockChancePct = 70;
var mockWords = ["ether", "ethereum", "bitcoin", "Ripple", "ETH", "BTC"];
var mockQuotes = [
    "Is that still used? I must have travelled way too far back in time...",
    "I think I remember that from history classes.",
    "That was nice project back in the old days...",
    "That's something Wright brothers used, isn't it?",
    "People are still using that? Interesting.",
    "There was short period when it was quite popular.",
    "Reminds me of something... not sure what though.",
    "Grandma loved to talk about it. Never seen it used though...",
    "Ah man, that was used waaay before my time."
];
// praise data
var praiseChancePct = 40;
var praiseWords = ["NEM", "XEM", "ProximaX"];
var praiseQuotes = [
    "You already use that guys? It changed my life.",
    "I see you already have it. Awesome!",
    "I came back here just to see it starting up."
];
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 *
 * @param min minimum value inclusive
 * @param max maximum value inclusive
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * return word that was present in the sentence or null if none was found
 *
 * @param words array of recognized words
 * @param sentence sentence to parse
 */
function getMatchWord(words, sentence) {
    // go lowercase to make things simpler
    sentence = sentence.toLowerCase();
    // iterate over words and try to find each in the sentence
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        // match using regular expression. \b is word boundary
        var re = new RegExp("\\b" + word.toLowerCase() + "\\b");
        if (re.test(sentence)) {
            // return matched word
            return word;
        }
    }
    // return null when no match was found
    return null;
}
/**
 * get response based on word recognition. Prefer to mock but some praise is fine as well
 *
 * @param words array of recognized words
 * @param quotes array of available quotes if word matches
 * @param chance percentual chance that response will be provided
 * @param sentence sentence to parse
 */
function getResponse(words, quotes, chance, sentence) {
    // computing the chance is supereasy compared to finding the match so lets do that first
    // chance of 0 is always true. chance of 100 is never true
    if (getRandomInt(1, 100) > chance) {
        // do nothing, bad luck
        return null;
    }
    // now get the word
    var word = getMatchWord(words, sentence);
    // if word was mateched then provide response
    if (word != null) {
        var index = getRandomInt(0, quotes.length - 1);
        var answer = quotes[index];
        return "Did you mention " + word + "? " + answer;
    }
    // return null when no match was found
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
    // first try to mock as that is more fun
    var response = getResponse(mockWords, mockQuotes, mockChancePct, message.text);
    if (response == null) {
        // if there is nothing to mock then see if we can at least praise
        response = getResponse(praiseWords, praiseQuotes, praiseChancePct, message.text);
    }
    // return the response if any
    if (response != null) {
        actions.reply(response);
    }
});
// NOTE: message actions are provided only for regex callbacks and subtypes of message events
webhook.on("edited_message", function (message) {
    // message actions not provided here
});
http.createServer(webhook.getWebhook())
    .listen(process.env.PORT || 3000, function () { return console.log("listening"); });
