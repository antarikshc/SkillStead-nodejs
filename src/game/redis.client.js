import redisCli from 'redis';
import bluebird from 'bluebird';

// Promisify Redis
bluebird.promisifyAll(redisCli.RedisClient.prototype);
bluebird.promisifyAll(redisCli.Multi.prototype);

// Redis client
let redis;

export default class RedisClient {
  /**
   * Connect to Redis server
   */
  static init() {
    redis = redisCli.createClient();

    redis.on('connect', () => {
      console.log('Redis client connected');
    });
  }

  /**
   * Retrieve match status
   * @param {String} matchId Key identifier
   */
  static getMatchStatus(matchId) {
    return redis.getAsync(`${matchId}-status`);
  }

  /**
   * Create/Update match status
   * @param {String} matchId Key identifier
   * @param {Object} status updated object
   */
  static setMatchStatus(matchId, status) {
    redis.set(`${matchId}-status`, JSON.stringify(status), redis.print);
  }

  /**
   * Push questions array
   * @param {String} matchId
   * @param {Array} questions
   */
  static setQuestions(matchId, questions) {
    redis.set(`${matchId}-questions`, JSON.stringify(questions), redis.print);
  }
}
