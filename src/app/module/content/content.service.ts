import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import prisma from '../../lib/prisma';

const db = prisma as any;

export const ContentService = {
  async getContentBySlug(slug: string) {
    const content = await db.content.findUnique({ where: { slug } });

    if (!content) {
      throw new AppError(status.NOT_FOUND, 'Content not found');
    }

    return content;
  },
};
