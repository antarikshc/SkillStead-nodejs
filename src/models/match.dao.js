import matchSchema from './match.schema';

let match;

export default class MatchDAO {
  /**
   * Inject MongoDB Client connection by Mongoose
   * @param {MongoDB Client} conn
   */
  static async injectDB(conn) {
    if (match) {
      return;
    }
    try {
      match = await conn.model('Match', matchSchema);
    } catch (e) {
      console.error(
        `Unable to establish a collection handled in MatchDAO: ${e}`,
      );
    }
  }

  /**
   * Retrieve Match object
   * @param {ObjectId} id
   */
  static getMatchById(id) {
    return match.findOne(id);
  }

  /**
   * Retrieve Matches object
   * @param {ObjectId} id
   */
  static getAllMatches() {
    return match.find();
  }

  /**
   * Add a Match into collections
   * @param {Object} object
   */
  static createMatch(object) {
    return match.create(object);
  }

  /**
   * Pushes a question into Match
   * @param {ObjectId} matchId
   * @param {Object} object
   */
  static addQuestionInMatch(matchId, object) {
    return match.findOneAndUpdate({ _id: matchId },
      {
        $push: {
          questions: object
        }
      });
  }

  /**
   * Sets isCompleted to true for intended match
   * @param {ObjectId} matchId
   */
  static completeMatch(matchId) {
    return match.findOneAndUpdate({ _id: matchId },
      {
        $set: {
          isCompleted: true
        }
      });
  }
}
