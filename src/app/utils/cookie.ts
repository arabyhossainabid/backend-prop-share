import { CookieOptions, Request, Response } from 'express';
import { envVars } from '../config/env';

const isProduction = envVars.NODE_ENV === 'production';

const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const setAccessTokenCookie = (res: Response, token: string) => {
    res.cookie('accessToken', token, accessTokenCookieOptions);
};

const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie('refreshToken', token, refreshTokenCookieOptions);
};

const clearAuthCookies = (res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};

const getCookie = (req: Request, name: string): string | undefined => {
    return req.cookies?.[name];
};

export const CookieUtils = {
    setAccessTokenCookie,
    setRefreshTokenCookie,
    clearAuthCookies,
    getCookie,
};
