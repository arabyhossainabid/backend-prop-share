import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import status from 'http-status';

/**
 * Get all users overview
 */
const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
                select: { investments: true, transactions: true, reviews: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

/**
 * Update user status (Active/Deactive) or Role
 */
const updateUser = async (id: string, payload: { role?: any, isActive?: boolean }) => {
    return await prisma.user.update({
        where: { id },
        data: payload
    });
};

/**
 * Review Property (Approve/Reject)
 */
const reviewProperty = async (id: string, status: 'APPROVED' | 'PENDING' | 'SOLD') => {
    return await prisma.property.update({
        where: { id },
        data: { status }
    });
};

/**
 * Get Platform Analytics
 */
const getPlatformAnalytics = async () => {
    const totalProperties = await prisma.property.count();
    const totalInvestors = await prisma.user.count({ where: { role: 'USER' } });
    const activeInvestments = await prisma.investment.count();
    const totalVolume = await prisma.transaction.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true }
    });

    return {
        totalProperties,
        totalInvestors,
        activeInvestments,
        totalVolume: totalVolume._sum.amount || 0,
    };
};

export const AdminService = {
    getAllUsers,
    updateUser,
    reviewProperty,
    getPlatformAnalytics
};
