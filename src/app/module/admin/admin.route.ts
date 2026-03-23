import { Router } from 'express';
import { AdminController } from './admin.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '@prisma/client';

const router = Router();

router.get(
    '/users',
    checkAuth(Role.ADMIN),
    AdminController.getAllUsers
);

router.patch(
    '/users/:userId/status',
    checkAuth(Role.ADMIN),
    AdminController.updateUserStatus
);

router.patch(
    '/users/:userId/role',
    checkAuth(Role.ADMIN),
    AdminController.updateUserRole
);

router.delete(
    '/users/:userId',
    checkAuth(Role.ADMIN),
    AdminController.deleteUser
);

router.get(
    '/stats',
    checkAuth(Role.ADMIN),
    AdminController.getDashboardStats
);

router.get(
    '/properties',
    checkAuth(Role.ADMIN),
    AdminController.getAllPropertiesAdmin
);

router.get(
    '/investments',
    checkAuth(Role.ADMIN),
    AdminController.getAllInvestmentsAdmin
);

router.post(
    '/categories',
    checkAuth(Role.ADMIN),
    AdminController.createCategory
);

router.patch(
    '/categories/:categoryId',
    checkAuth(Role.ADMIN),
    AdminController.updateCategory
);

router.delete(
    '/categories/:categoryId',
    checkAuth(Role.ADMIN),
    AdminController.deleteCategory
);

router.patch(
    '/properties/:propertyId/featured',
    checkAuth(Role.ADMIN),
    AdminController.updatePropertyFeatured
);

export const AdminRoutes: Router = router;
