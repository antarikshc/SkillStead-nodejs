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
    UsersDao.createUser(req.body)
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

  /**
   * Return User Object from DAO
   */
  static apiLogin(req, res, next) {
    UsersDao.getUserByQuery({ email: req.body.email })
      .then((user) => {
        if (user.password === req.body.password) {
          res.status(200).json({
            message: 'Login Successful!',
            validation: true,
            data: {
              user_id: user._id
            }
          });
        } else {
          res.status(401).json({
            message: 'Wrong password!',
            validation: false
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: 'Error occured!',
        });
      });
  }
}
