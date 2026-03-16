import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import status from 'http-status';

/**
 * Create or update a review for a property
 */
const createReview = async (userId: string, payload: { propertyId: string; rating: number; comment: string }) => {
    return await prisma.review.upsert({
        where: {
            userId_propertyId: { userId, propertyId: payload.propertyId }
        },
        update: {
            rating: payload.rating,
            comment: payload.comment
        },
        create: {
            userId,
            propertyId: payload.propertyId,
            rating: payload.rating,
            comment: payload.comment
        }
    });
};

/**
 * Get all reviews for a property
 */
const getPropertyReviews = async (propertyId: string) => {
    return await prisma.review.findMany({
        where: { propertyId },
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' }
    });
};

export const ReviewService = {
    createReview,
    getPropertyReviews
};
