import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { envVars } from '../config/env';
import { IRequestUser } from '../interfaces/requestUser.interface';

const signToken = (payload: object, secret: string, expiresIn: string): string => {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, secret: string): { success: boolean; data?: JwtPayload } => {
    try {
        const data = jwt.verify(token, secret) as JwtPayload;
        return { success: true, data };
    } catch {
        return { success: false };
    }
};

const getAccessToken = (payload: IRequestUser): string => {
    return signToken(payload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES_IN);
};

const getRefreshToken = (payload: IRequestUser): string => {
    return signToken(payload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES_IN);
};

export const jwtUtils = {
    signToken,
    verifyToken,
    getAccessToken,
    getRefreshToken,
};
