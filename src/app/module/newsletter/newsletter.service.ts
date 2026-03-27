import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';

const db = prisma as any;

const subscribe = async (email: string) => {
  const isExist = await db.newsletter.findUnique({ where: { email } });
  if (isExist)
    throw new AppError(status.BAD_REQUEST, 'You are already subscribed!');

  const result = await db.newsletter.create({ data: { email } });
  return result;
};

export const NewsletterService = {
  subscribe,
};
