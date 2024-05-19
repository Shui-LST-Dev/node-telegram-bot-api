/**
 * This example demonstrates using polling.
 * It also demonstrates how you would process and send messages.
 */


const TOKEN = process.env.TELEGRAM_TOKEN || '6889427935:AAHU5RzOOHomQNKmLZhOBhlKQU-qNaS2F2g';
const TelegramBot = require('node-telegram-bot-api'); // Make sure to require 'node-telegram-bot-api'
const request = require('@cypress/request');

const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();
const topicName = 'your-topic-name'; // Replace with your Pub/Sub topic name

const options = {
  polling: true
};
const bot = new TelegramBot(TOKEN, options);

async function publishMessage(message) {
  const dataBuffer = Buffer.from(message);
  try {
      const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
      console.log(`Message ${messageId} published.`);
  } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
  }
}

// Matches /photo
bot.onText(/\/photo/, function onPhotoText(msg) {
  // From file path
  const photo = `${__dirname}/../test/data/photo.gif`;
  bot.sendPhoto(msg.chat.id, photo, {
    caption: "I'm a bot!"
  });
});

//Start up greeting message
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Welcome, your DMs are now streaming to the DM Extension.");
  
  });

  bot.on('message', (msg) => {
    console.log(msg); // Log the message object to see what's coming in
    
    // Extract the text from the message
    const chatId = msg.chat.id;
    const text = msg.text || 'Empty message';

    // Send a reply back to the chat
    bot.sendMessage(chatId, `Received your message: ${text}`);
  });