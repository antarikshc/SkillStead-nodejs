import CategoryDAO from '../models/category.dao';
import QuestionDAO from '../models/question.dao';

export default class CategoryController {
  /**
   * Get category by Id
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  static apiGetCategoryById(req, res, next) {
    CategoryDAO.getCategoryById(req.params.id)
      .then((category) => {
        res.status(200).json(category);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Error occured!',
        });
      });
  }

  /**
   * Get category by code
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  static apiGetCategoryByCode(req, res, next) {
    CategoryDAO.getCategoryByCode(req.params.code)
      .then((category) => {
        res.status(200).json(category);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Error occured!',
        });
      });
  }

  /**
   * Create a Category
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  static apiCreateCategory(req, res, next) {
    CategoryDAO.createCategory(req.body)
      .then((category) => {
        res.status(200).json({
          message: 'Category created Successful!',
          data: {
            category_id: category._id
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

  /**
   * Add Question in Category
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  static apiAddQuestionInCategoryId(req, res, next) {
    QuestionDAO.createQuestion(req.body)
      .then((question) => {
        CategoryDAO.addQuestionById(req.params.id, question._id)
          .then((category) => {
            res.status(200).json({
              message: `Question added in ${category.name}!`
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: 'Error occured!',
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Error occured!',
        });
      });
  }

  /**
 * Add Question in Category
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
  static apiAddQuestionInCategoryCode(req, res, next) {
    QuestionDAO.createQuestion(req.body)
      .then((question) => {
        CategoryDAO.addQuestionByCode(req.params.code, question._id)
          .then((category) => {
            res.status(200).json({
              message: `Question added in ${category.name}!`
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: 'Error occured!',
            });
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
