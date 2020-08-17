// change the line below to:
// const { HiveBot } = require('hive-bot');
const { HiveBot } = require('../src/loader');

const username = 'Your Hive Username';
const postingKey = 'Your Posting Key'; // Use environment variables instead of hardcoding to be safer

const targetUsers = ['ali-h'];
const bot = new HiveBot({username, postingKey});

bot.onDeposit(targetUsers, handleDeposit);

function handleDeposit(data, responder) {
  console.log('recevied %s deposit from %s to %s!', data.amount, data.from, data.to);
  console.log(data.memo);
  // you get the money now give your service to user
}

bot.start();

/*
This bot will Leave a console message with information about all deposits to user @ali-h
*/