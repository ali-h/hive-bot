// change the line below to:
// const { HiveBot } = require('hive-bot');
const { HiveBot } = require('../src/loader');

const username = 'Your Hive Username';
const postingKey = 'Your Posting Key'; // Use environment variables instead of hardcoding to be safer

const bot = new HiveBot({username, postingKey});

bot.onComment(handleComment);

function handleComment(data, responder) {
  console.log('user %s commented!', data.author);
  //console.log(data.body);
  responder.comment('Hy you can not hide!!').catch((err) => {
    console.log('Some error happened while posting comment');
    // maybe retry commenting?
    //responder.comment('Oh ERRRORRS');
  });
}

// you can catch errors regarding node failure here
bot.start().catch((err) => {
  console.log('Oops, node failed!');
  console.log(err);
  // no need to start it again manually, a re-try attempt will happens every 5s
});

/*
This bot is made to Upvote and Comment on every comment on the Blockchain
it has Error Handling which can be used to retry failed attempts or notify error
*/