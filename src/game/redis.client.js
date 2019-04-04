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
  static async init() {
    redis = redisCli.createClient();

    redis.on('connect', () => {
      console.log('Connection established: Redis');
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
    redis.getAsync(`${matchId}-status`)
      .then((result) => {
        const matchStatus = JSON.parse(result);
        matchStatus.status = 1;
        matchStatus.questions = questions;
        redis.set(`${matchId}-status`, JSON.stringify(matchStatus), redis.print);
      });
  }
}
