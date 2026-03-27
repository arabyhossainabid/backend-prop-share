import { prisma } from '../../lib/prisma';

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: { _count: { select: { properties: true } } },
    orderBy: { name: 'asc' },
  });
};

export const CategoryService = {
  getAllCategories,
};
