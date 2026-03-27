import { Router } from 'express';
import { CategoryController } from './category.controller';

const router = Router();

// Public
router.get('/', CategoryController.getAllCategories);

export const CategoryRoutes: Router = router;
