import userSchema from './user.schema';

let users;

export default class UsersDAO {
  /**
   * Inject MongoDB Client connection by Mongoose
   * @param {MongoDB Client} conn
   */
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.model('User', userSchema);
    } catch (e) {
      console.error(
        `Unable to establish a collection handled in UserDAO: ${e}`,
      );
    }
  }

  /**
   * Retrieve User object
   * @param {ObjectId} id
   */
  static getUserById(id) {
    return users.findOne(id);
  }

  /**
   * Create user
   * @param {Object} user
   */
  static createUser(user) {
    return users.create(user);
  }

  /**
   * Retrieve user by running query
   * @param {Object} query
   */
  static getUserByQuery(query) {
    return users.findOne(query)
      .select('+password');
  }
}
