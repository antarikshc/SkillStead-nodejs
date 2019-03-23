import { Router } from 'express';
import QuestionCtrl from './question.controller';

const router = new Router();

router.route('/').get(QuestionCtrl.apiGetAllQuestions);
router.route('/').post(QuestionCtrl.apiCraeteQuestion);

export default router;
