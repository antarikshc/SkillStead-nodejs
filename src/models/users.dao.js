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
   * @param {ObjectId} id User Id
   */
  static getUserById(id) {
    return users.findOne(id);
  }

  /**
   * Add User into collections
   * @param {userSchema} user User object
   */
  static addUser(user) {
    return users.create(user);
  }
}
