import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { checkAuth } from '../../middleware/checkAuth';
import validateRequest from '../../middleware/validateRequest';
import { Role } from '@prisma/client';

const router = Router();

// Local Auth
router.post('/register', validateRequest(AuthValidation.register), AuthController.registerUser);
router.post('/login', validateRequest(AuthValidation.login), AuthController.loginUser);
router.post('/logout', AuthController.logoutUser);

// Social Auth (Google)
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    AuthController.socialLoginCallback
);

// Profile
router.get('/me', checkAuth(Role.ADMIN, Role.USER), AuthController.getMe);

export const AuthRoutes = router;
