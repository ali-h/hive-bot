// change the line below to:
// const { HiveBot } = require('hive-bot');
const { HiveBot } = require('../src/loader');

const username = 'Your Hive Username';
const postingKey = 'Your Posting Key'; // Use environment variables instead of hardcoding to be safer

targetUsers = ['ali-h', 'blocktrades']
const bot = new HiveBot({username, postingKey});

bot.onPost(targetUsers, handlePost);

function handlePost(data, responder) {
  console.log('user %s posted!', data.author);

  responder.comment('Hi there! I just upvoted you using HiveBot JavaScript library!');
  responder.upvote(); // 100% upvote
  /*
  or for downvote:
  responder.downvote(5); // 5% downvote (flag)
  */
}

bot.start();

/*
This bot will upvote all posts from the users @ali-h & @blocktrades
*/