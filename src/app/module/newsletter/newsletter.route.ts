import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { NewsletterController } from './newsletter.controller';
import { NewsletterValidation } from './newsletter.validation';

const router = Router();

// Public subscription
router.post(
  '/subscribe',
  validateRequest(NewsletterValidation.subscribeSchema),
  NewsletterController.subscribe
);

export const NewsletterRoutes: Router = router;
