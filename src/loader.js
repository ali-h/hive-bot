const hivejs = require('@hivechain/hivejs');
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