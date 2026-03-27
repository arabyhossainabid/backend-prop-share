import { Router } from 'express';
import { ContentController } from './content.controller';

const router = Router();

// Public routes
router.get('/:slug', ContentController.getContentBySlug);

export const ContentRoutes: Router = router;
