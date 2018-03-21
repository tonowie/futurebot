// do not forget to register the webhook
// curl -F "url=https://vast-fortress-52095.herokuapp.com" https://api.telegram.org/bot{bot token}/setWebhook
// app now needs env variable with token
// heroku config:set BOT_TOKEN={bot token}

import http = require("http");
import { Message, MessageActions, TelegramBotClient, Webhook } from "api-telegram-bot";

const bot = new TelegramBotClient(process.env.BOT_TOKEN);
const webhook = new Webhook(bot);
const badWords = ["fuck", "bitch", "shit", "fucking", "fucker"];

function hasMatch(firstArray, secondArray) {
	for (var i = 0; i < firstArray.length; i++) {
		for (var j = 0; j < secondArray.length; j++) {
			if (firstArray[i] == secondArray[j]) {
				return true;
			}
		}
	}
    return false;
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
  const words = message.text.split(" ");
  if (hasMatch(badWords, words)) {
	  actions.reply("That is just what I thought... about you!");
  } else {
	  actions.reply(`"${message.text}" to you as well`);
  }
});


// NOTE: message actions are provided only for regex callbacks and subtypes of message events
webhook.on("edited_message", (message: Message) => {
  // message actions not provided here
});

http.createServer(webhook.getWebhook())
  .listen(process.env.PORT || 3000, () => console.log("listening"));