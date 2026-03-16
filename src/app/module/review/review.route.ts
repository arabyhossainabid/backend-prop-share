import { Router } from 'express';
import { ReviewController } from './review.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '@prisma/client';
import validateRequest from '../../middleware/validateRequest';
import { ReviewValidation } from './review.validation';

const router = Router();

router.get('/:propertyId', ReviewController.getPropertyReviews);

router.post(
    '/',
    checkAuth(Role.USER, Role.ADMIN),
    validateRequest(ReviewValidation.create),
    ReviewController.createReview
);

export const ReviewRoutes = router;
