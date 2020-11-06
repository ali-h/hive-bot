const hivejs = require('@hiveio/hive-js');
const { HiveBotCore } = require('./core.js'); // get HiveBotCore from core.js constant
const { ALL_USERS } = require('./constants.js'); // get ALL_USERS constant

function getConfig(args) {
  let targets;
  let handler;

  if (args.length > 2) {
    throw(new Error('Your event function should only have one or two arguments'));
  }

  if (typeof(args[0]) === 'function') { // user omitted targets (target users) param
    targets = ALL_USERS;
    handler = args[0];
  } else {
    targets = typeof(args[0]) === 'string' ? [args[0]] : args[0];
    handler = args[1];
  }

  return {
    handler,
    targets,
  };
}

class HiveBot {
  constructor({username, postingKey, activeKey, node}) {
    this.username = username && username.replace(/^@/, '');
    this.postingKey = postingKey;
    this.activeKey = activeKey;
    this.config = {};
    this.node = node;

    // no need of username if observing only
    
    // if (!username) {
    //   throw(new Error('Define your username as the first param of HiveBot constructor'));
    // }
  }

  onDeposit(...args) {
    this.config.deposit = getConfig(args);
  }

  onPost(...args) {
    this.config.post = getConfig(args);
  }

  onComment(...args) {
    this.config.comment = getConfig(args);
  }

  start() {
    const loader = new HiveBotCore({
      username: this.username,
      activeKey: this.activeKey,
      postingKey: this.postingKey,
      config: this.config, // all the functions called in the bot gets into config for HiveBotCore
      node: this.node,
    });
    return loader.init();
  }
}

module.exports.HiveBot = HiveBot;