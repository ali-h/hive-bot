// change the line below to:
// const { HiveBot } = require('hive-bot');
const { HiveBot } = require('../src/loader');

const username = 'Your Hive Username';
const postingKey = 'Your Posting Key'; // Use environment variables instead of hardcoding to be safer

const node = 'https://api.openhive.network';
const bot = new HiveBot({username, postingKey, node});

bot.onComment(handleComment);

function handleComment(data, responder) {
  console.log('user %s commented!', data.author);
}

bot.start();

/*
This bot will operate with "https://api.openhive.network" api
Default api for HiveBot is https://api.hive.blog
*/