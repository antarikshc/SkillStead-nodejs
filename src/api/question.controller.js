import QuestionDAO from '../models/question.dao';

export default class QuestionController {
  /**
   * Get All questions
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  static apiGetAllQuestions(req, res, next) {
    QuestionDAO.getAllQuestions()
      .then((questions) => {
        res.status(200).json(questions);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Error occured!',
        });
      });
  }

  /**
   * Create a question
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  static apiCraeteQuestion(req, res, next) {
    QuestionDAO.createQuestion(req.body)
      .then((question) => {
        res.status(200).json({
          message: 'Question created!',
          validation: true,
          data: {
            question_id: question._id
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Error occured!',
        });
      });
  }
}
