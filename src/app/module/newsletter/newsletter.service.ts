import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import status from 'http-status';

const db = prisma as any;

const subscribe = async (email: string) => {
    const isExist = await db.newsletter.findUnique({ where: { email } });
    if (isExist) throw new AppError(status.BAD_REQUEST, 'You are already subscribed!');

    const result = await db.newsletter.create({ data: { email } });
    return result;
};

const getAllSubscribers = async () => {
    return await db.newsletter.findMany({
        orderBy: { createdAt: 'desc' },
    });
};

const unsubscribe = async (email: string) => {
    return await db.newsletter.delete({ where: { email } });
};

export const NewsletterService = {
    subscribe,
    getAllSubscribers,
    unsubscribe,
};
