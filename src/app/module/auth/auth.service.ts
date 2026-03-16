import bcrypt from 'bcryptjs';
import status from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import { jwtUtils } from '../../utils/jwt';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { ILoginUserResponse } from './auth.interface';

/**
 * Register a new investor
 */
const registerUser = async (payload: any) => {
    const isUserExist = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (isUserExist) {
        throw new AppError(status.CONFLICT, 'User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    const newUser = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword,
            role: 'USER',
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });

    return newUser;
};

/**
 * Login with email and password
 */
const loginUser = async (payload: any): Promise<ILoginUserResponse> => {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    if (!user.isActive) {
        throw new AppError(status.FORBIDDEN, 'Your account is deactivated');
    }

    if (!user.password) {
        throw new AppError(status.BAD_REQUEST, 'Please login through social login or reset password');
    }

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordMatched) {
        throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
    }

    const userPayload: IRequestUser = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    };

    const accessToken = jwtUtils.getAccessToken(userPayload);
    const refreshToken = jwtUtils.getRefreshToken(userPayload);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        },
    };
};

/**
 * Social Login (Google)
 */
const socialLogin = async (payload: { name: string; email: string; provider: string; providerAccountId: string; avatar?: string }) => {
    let user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                avatar: payload.avatar,
                role: 'USER',
                accounts: {
                    create: {
                        provider: payload.provider,
                        providerAccountId: payload.providerAccountId,
                    },
                },
            },
        });
    } else {
        const account = await prisma.account.findFirst({
            where: {
                userId: user.id,
                provider: payload.provider,
            },
        });

        if (!account) {
            await prisma.account.create({
                data: {
                    userId: user.id,
                    provider: payload.provider,
                    providerAccountId: payload.providerAccountId,
                },
            });
        }
    }

    const userPayload: IRequestUser = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    };

    const accessToken = jwtUtils.getAccessToken(userPayload);
    const refreshToken = jwtUtils.getRefreshToken(userPayload);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        },
    };
};

/**
 * Get current profile
 */
const getMe = async (user: IRequestUser) => {
    const result = await prisma.user.findUnique({
        where: { id: user.userId },
        include: {
            _count: {
                select: { investments: true, transactions: true }
            }
        }
    });

    if (!result) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    const { password, ...others } = result;
    return others;
};

export const AuthService = {
    registerUser,
    loginUser,
    socialLogin,
    getMe,
};
