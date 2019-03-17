import { Router } from 'express';
import UserCtrl from './users.controller';

const router = new Router();

router.route('/id/:id').get(UserCtrl.apiGetUserById);
router.route('/signup').post(UserCtrl.apiSignUp);
router.route('/login').post(UserCtrl.apiLogin);

export default router;
