// do not forget to register the webhook
// curl -F "url=https://vast-fortress-52095.herokuapp.com" https://api.telegram.org/bot{bot token}/setWebhook
// app now needs env variable with token
// heroku config:set BOT_TOKEN={bot token}

import http = require("http");
import { Message, MessageActions, TelegramBotClient, Webhook } from "api-telegram-bot";

const bot = new TelegramBotClient(process.env.BOT_TOKEN);
const webhook = new Webhook(bot);
const cryptoWords = ["ETH", "BTC", "ether", "ethereum", "bitcoin"];

function getMatch(words, sentence) {
	for (var i = 0; i < words.length; i++) {
		const word = words[i];
		if (sentence.toLowerCase().split(word.toLowerCase()) >= 0) {
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
webhook.on("text", (message: Message, actions: MessageActions) => {
  const word = getMatch(cryptoWords, message.text);
  if (word != null) {
	  actions.reply(word + "? Is that still used? I must have travelled way too far back in time...");
  }
});


// NOTE: message actions are provided only for regex callbacks and subtypes of message events
webhook.on("edited_message", (message: Message) => {
  // message actions not provided here
});

http.createServer(webhook.getWebhook())
  .listen(process.env.PORT || 3000, () => console.log("listening"));