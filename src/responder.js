const hivejs = require('@hivechain/hivejs');
const HiveBotVersion = '0.6.1';

/**
 * This function is extracted from condenser source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 */
function createCommentPermlink(parentAuthor, parentPermlink, postingKey, activeKey) {
  let permlink;

  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  const newParentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parentAuthor}-${newParentPermlink}-${timeStr}`;

  if (permlink.length > 255) {
    // HIVE_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
}

function getContent(author, permlink) {
  return hivejs.api.getContentAsync(author, permlink);
}

function convert2VotingWeight(votingPercentage) {
  return Math.min(Math.floor(votingPercentage.toFixed(2) * 100), 10000);
}

class Responder {
  constructor({targetUsername, targetPermlink, transferMemo, responderUsername, postingKey, activeKey}) {
    this.targetUsername = targetUsername;
    this.targetPermlink = targetPermlink;
    this.transferMemo = transferMemo;
    this.responderUsername = responderUsername;
    this.postingKey = postingKey;
    this.activeKey = activeKey;
  }

  _throwErrorIfNoKey() {
    if (!(this.postingKey || this.activeKey)) {
      throw(
        new Error('You need to introduce a postingKey or activeKey to HiveBot\'s constructor')
      );
    }
  }

  _throwErrorIfNoActiveKey() {
    if (!(this.activeKey)) {
      throw(
        new Error('You need to introduce an activeKey to HiveBot\'s constructor')
      );
    }
  }

  _throwErrorIfNoPermlink(targetPermlink) {
    if (!targetPermlink) {
      throw(
        new Error(
          'You cannot send a comment to a responder comming from a deposit. There is no address to send a comment to!'
        )
      );
    }
  }

  sendHive(amount, memo = '') {
    this._throwErrorIfNoActiveKey();

    const from = this.responderUsername;
    const to = this.targetUsername;
    amount = `${parseFloat(amount).toFixed(3)} HIVE`;

    return hivejs.broadcast.transferAsync(
      this.activeKey,
      from,
      to,
      amount,
      memo
    );
  }

  sendHbd(amount, memo) {
    this._throwErrorIfNoActiveKey();

    const from = this.responderUsername;
    const to = this.targetUsername;
    amount = `${parseFloat(amount).toFixed(3)} HBD`;

    return hivejs.broadcast.transferAsync(
      this.activeKey,
      from,
      to,
      amount,
      memo
    );
  }

  comment(
    message,
    targetUsername = this.targetUsername,
    targetPermlink = this.targetPermlink
  ) {
    // early exits
    this._throwErrorIfNoPermlink(targetPermlink);
    this._throwErrorIfNoKey();

    const permlink = createCommentPermlink(targetUsername, targetPermlink);
    const wif = this.postingKey || this.activeKey;
    const jsonMetadata = JSON.stringify({
      app: `hive-bot/${HiveBotVersion}`,
    });

    return hivejs.broadcast.commentAsync(
      wif,
      targetUsername,
      targetPermlink,
      this.responderUsername,
      permlink,
      '',
      message,
      jsonMetadata,
    );
  }

  upvote(
    votingPercentage = 100.0,
    targetUsername = this.targetUsername,
    targetPermlink = this.targetPermlink
  ) {
    this._throwErrorIfNoKey();
    this._throwErrorIfNoPermlink(targetPermlink);

    if (typeof(votingPercentage) === 'string') {
      votingPercentage = parseFloat(votingPercentage);
    }

    if (votingPercentage < 0) {
      throw(new Error(`Don't use negative numbers on upvote() method. Use downvote() instead.`));
    }

    const votingWeight = convert2VotingWeight(votingPercentage);
    const wif = this.postingKey || this.activeKey;

    return hivejs.broadcast.voteAsync(
      wif,
      this.responderUsername,
      targetUsername,
      targetPermlink,
      votingWeight
    );
  }

  downvote(
    votingPercentage = 100.0,
    targetUsername = this.targetUsername,
    targetPermlink = this.targetPermlink
  ) {
    this._throwErrorIfNoKey();
    this._throwErrorIfNoPermlink(targetPermlink);

    if (typeof(votingPercentage) === 'string') {
      votingPercentage = parseFloat(votingPercentage);
    }

    if (votingPercentage < 0) {
      throw(
        new Error(
          `Don't use negative numbers on downvote() method. The vote will be negative from this API anyway.`
        )
      );
    }

    const votingWeight = convert2VotingWeight(votingPercentage) * -1;
    const wif = this.postingKey || this.activeKey;

    return hivejs.broadcast.voteAsync(
      wif,
      this.responderUsername,
      targetUsername,
      targetPermlink,
      votingWeight,
    );
  }
}

module.exports.Responder = Responder;