import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import status from 'http-status';
import { VoteType } from '@prisma/client';

const db = prisma as any;

const vote = async (userId: string, propertyId: string, voteType: VoteType) => {
    const property = await db.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new AppError(status.NOT_FOUND, 'Property not found');

    const result = await db.vote.upsert({
        where: { userId_propertyId: { userId, propertyId } },
        update: { voteType },
        create: { userId, propertyId, voteType },
    });

    return { message: 'Vote recorded', data: result };
};

const removeVote = async (userId: string, propertyId: string) => {
    await db.vote.delete({
        where: { userId_propertyId: { userId, propertyId } },
    });
    return { message: 'Vote removed' };
};

const getPropertyVotes = async (propertyId: string) => {
    const votes = await db.vote.findMany({ where: { propertyId } });
    const upvotes = votes.filter((v: any) => v.voteType === VoteType.UPVOTE).length;
    const downvotes = votes.filter((v: any) => v.voteType === VoteType.DOWNVOTE).length;
    return { upvotes, downvotes, total: upvotes - downvotes };
};

const getUserVoteOnProperty = async (userId: string, propertyId: string) => {
    return await db.vote.findUnique({
        where: { userId_propertyId: { userId, propertyId } },
    });
};

export const VoteService = {
    vote,
    removeVote,
    getPropertyVotes,
    getUserVoteOnProperty,
};
