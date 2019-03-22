import { Router } from 'express';
import CategoryCtrl from './category.controller';

const router = new Router();

router.route('/id/:id').get(CategoryCtrl.apiGetCategoryById);
router.route('/code/:code').get(CategoryCtrl.apiGetCategoryByCode);
router.route('/id/:id/question').post(CategoryCtrl.apiAddQuestionInCategoryId);
router.route('/code/:code/question').post(CategoryCtrl.apiAddQuestionInCategoryCode);
router.route('/').post(CategoryCtrl.apiCreateCategory);

export default router;
