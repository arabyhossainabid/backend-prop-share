import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';
import validateRequest from '../../middleware/validateRequest';
import { NewsletterValidation } from './newsletter.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '@prisma/client';

const router = Router();

// Public subscription
router.post(
    '/subscribe',
    validateRequest(NewsletterValidation.subscribeSchema),
    NewsletterController.subscribe
);

// Admin only view
router.get(
    '/subscribers',
    checkAuth(Role.ADMIN),
    NewsletterController.getAllSubscribers
);

router.post(
    '/unsubscribe',
    NewsletterController.unsubscribe
);

export const NewsletterRoutes: Router = router;
