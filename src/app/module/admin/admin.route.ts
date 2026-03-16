import { Router } from 'express';
import { AdminController } from './admin.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '@prisma/client';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidation } from './admin.validation';

const router = Router();

// All routes here are ADMIN only
router.use(checkAuth(Role.ADMIN));

router.get('/users', AdminController.getAllUsers);

router.patch(
    '/users/:id',
    validateRequest(AdminValidation.updateUser),
    AdminController.updateUser
);

router.patch(
    '/properties/:id/review',
    validateRequest(AdminValidation.reviewProperty),
    AdminController.reviewProperty
);

router.get('/analytics', AdminController.getAnalytics);

export const AdminRoutes = router;
