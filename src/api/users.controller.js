import UsersDao from '../models/users.dao';

export default class UsersController {
  /**
   * Return User Object from DAO
   */
  static apiGetUserById(req, res, next) {
    UsersDao.getUserById(req.body.id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Error occured!',
        });
      });
  }

  /**
   * Insert User Object into DB
   */
  static apiSignUp(req, res, next) {
    UsersDao.addUser(req.body)
      .then((user) => {
        res.status(200).json({
          message: 'Sign Up Successful!',
          validation: true,
          data: {
            user_id: user._id
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
