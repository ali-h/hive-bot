// change the line below to:
// const { HiveBot } = require('hive-bot');
const { HiveBot } = require('../src/loader');

const bot = new HiveBot({});

bot.onDeposit((data, responder)=> {
  console.log('@%s sent %s to @%s', data.from, data.amount, data.to);
});
bot.onPost((data, responder)=> {
  console.log('@%s authored a new post => %s', data.author, data.permlink);
});
bot.onComment((data, responder)=> {
  console.log('@%s commented on @%s\'s post => %s', data.author, data.parent_author, data.permlink);
});

bot.start();

/*
This bot will leave a console message whenever Deposits, Posts, Comments happen on the blockchain
*/