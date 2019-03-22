import categorySchema from './category.schema';

let category;

export default class CategoryDAO {
  /**
   * Inject MongoDB Client connection by Mongoose
   * @param {MongoDB Client} conn
   */
  static async injectDB(conn) {
    if (category) {
      return;
    }
    try {
      category = await conn.model('Category', categorySchema);
    } catch (e) {
      console.error(
        `Unable to establish a collection handled in CategoryDAO: ${e}`,
      );
    }
  }

  /**
   * Retrieve Category object
   * @param {ObjectId} id
   */
  static getCategoryById(id) {
    return category.findOne(id);
  }

  /**
   * Retrieve a category by code
   * @param {String} categoryCode
   */
  static getCategoryByCode(categoryCode) {
    return category.findOne({
      code: categoryCode
    });
  }

  /**
   * Creates a category
   * @param {Object} object
   */
  static createCategory(object) {
    return category.create(object);
  }

  /**
   * Adds a quesition into category
   * @param {String} categoryId
   * @param {ObjectId} question
   */
  static addQuestion(categoryId, question) {
    return category.findOneAndUpdate({ _id: categoryId },
      {
        $push: {
          questions: question
        }
      });
  }
}
