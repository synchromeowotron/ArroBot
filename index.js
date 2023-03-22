const Discord = require('discord.js');
const fetch = require('node-fetch');

const { Client, GatewayIntentBits } = require('discord.js');
var emojiCache;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
  
API_URL = 'https://api-inference.huggingface.co/models/Mogwhy/DialoGPT-medium-Arrobot';

console.log("Initializing . . .")

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    emojiCache = client.emojis.cache;
    console.log(emojiCache.toString());
});

client.on('messageCreate', async message => {
    console.log("Author: " + message.author.username + "\n" + "Content: " + message.content + "\n - - - ");
    if (message.author.bot) {
        return;
    }

    if (message.content.startsWith("Arro,")) {
      var inputText = message.content.slice(5);
      const payload = {
          inputs: {
              text: inputText
          }
      };
      
      const headers = {
          'Authorization': 'Bearer ' + process.env.HUGGINGFACE_TOKEN
      };
      
      await message.channel.sendTyping();
      const response = await fetch(API_URL, {
          method: 'post',
          body: JSON.stringify(payload),
          headers: headers
      });
      const data = await response.json();
      let botResponse = '';
      if (data.hasOwnProperty('generated_text')) {
          botResponse = data.generated_text;
      } else if (data.hasOwnProperty('error')) { 
          botResponse = data.error;
      }
      
      if (botResponse.toString().startsWith(" :blob")) {
        var emojiSearchString = botResponse.toString().substring(
                                botResponse.toString().indexOf(":") + 1, 
                                botResponse.toString().lastIndexOf(":"));
        emojiCache.forEach((K, V) => {
          if (K.name.toString() === emojiSearchString) {
            botResponse = K.toString();
          }
        })
      }
      message.reply(botResponse);
    }
})

console.log("Logged in and working . . . I hope.")
client.login(process.env.DISCORD_TOKEN);