import { Prisma, Role } from '@prisma/client';
import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';

const createMessage = async (
  data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  },
  user?: IRequestUser
) => {
  return await prisma.contact.create({
    data: {
      ...data,
      userId: user?.userId,
    },
  });
};

const getAllMessages = async (query: Record<string, unknown>) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const search = (query.search as string | undefined)?.trim();
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { message: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.contact.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const deleteMessage = async (contactId: string) => {
  try {
    return await prisma.contact.delete({
      where: {
        id: contactId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AppError(status.NOT_FOUND, 'Contact thread not found');
      }
    }

    throw error;
  }
};

const getMyMessages = async (userId: string) => {
  return await prisma.contact.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      message: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const ensureThreadAccess = async (contactId: string, user: IRequestUser) => {
  const contact = await prisma.contact.findUnique({
    where: {
      id: contactId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!contact) {
    throw new AppError(status.NOT_FOUND, 'Contact thread not found');
  }

  if (user.role === Role.USER && contact.userId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to access this contact thread'
    );
  }

  return contact;
};

const getReplies = async (contactId: string, user: IRequestUser) => {
  await ensureThreadAccess(contactId, user);

  const replies = await prisma.contactReply.findMany({
    where: {
      contactId,
    },
    include: {
      sender: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return replies.map((reply) => ({
    id: reply.id,
    senderRole: reply.senderRole,
    senderName: reply.sender.name,
    message: reply.message,
    createdAt: reply.createdAt,
  }));
};

export const ContactService = {
  createMessage,
  getAllMessages,
  deleteMessage,
  getMyMessages,
  getReplies,
};
