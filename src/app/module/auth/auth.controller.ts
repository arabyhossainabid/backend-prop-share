import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { AuthService } from './auth.service';
import { CookieUtils } from '../../utils/cookie';
import { envVars } from '../../config/env';

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: 'Registration successful! Welcome to PropShare.',
        data: result,
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);
    const { accessToken, refreshToken, user } = result;

    CookieUtils.setAccessTokenCookie(res, accessToken);
    CookieUtils.setRefreshTokenCookie(res, refreshToken);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Login successful',
        data: { user, accessToken, refreshToken },
    });
});

const socialLoginCallback = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as any; // From Passport Google strategy

    const result = await AuthService.socialLogin({
        name: user.displayName,
        email: user.emails[0].value,
        provider: 'google',
        providerAccountId: user.id,
        avatar: user.photos ? user.photos[0].value : undefined,
    });

    const { accessToken, refreshToken } = result;

    CookieUtils.setAccessTokenCookie(res, accessToken);
    CookieUtils.setRefreshTokenCookie(res, refreshToken);

    // Redirect to frontend with tokens (simplified for this assignment)
    res.redirect(`${envVars.FRONTEND_URL}/auth-callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const user = req.verifiedUser!;
    const result = await AuthService.getMe(user);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Profile fetched successfully',
        data: result,
    });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    CookieUtils.clearAuthCookies(res);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Logged out successfully',
    });
});

export const AuthController = {
    registerUser,
    loginUser,
    socialLoginCallback,
    getMe,
    logoutUser,
};
