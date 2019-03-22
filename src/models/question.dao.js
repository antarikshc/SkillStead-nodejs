import questionSchema from './question.schema';

let question;

export default class QuestionDAO {
  /**
   * Inject MongoDB Client connection by Mongoose
   * @param {MongoDB Client} conn
   */
  static async injectDB(conn) {
    if (question) {
      return;
    }
    try {
      question = await conn.model('Question', questionSchema);
    } catch (e) {
      console.error(
        `Unable to establish a collection handled in QuestionDAO: ${e}`,
      );
    }
  }

  /**
   * Retrieve Question object
   * @param {ObjectId} id
   */
  static getQuestionById(id) {
    return question.findOne(id);
  }

  /**
   * Add a Question into collections
   * @param {Object} object
   */
  static createQuestion(object) {
    return question.create(object);
  }
}
