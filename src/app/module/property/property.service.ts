import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import status from 'http-status';
import { Prisma } from '@prisma/client';

/**
 * Create a new property listing (Admin only)
 */
const createProperty = async (payload: any) => {
    return await prisma.property.create({
        data: {
            ...payload,
            availableShares: payload.totalShares,
        },
    });
};

/**
 * Get all properties with filters
 */
const getAllProperties = async (query: any) => {
    const { searchTerm, location, status: propStatus, isTrending, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.PropertyWhereInput = {};

    if (searchTerm) {
        where.OR = [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }

    if (location) {
        where.location = { contains: location, mode: 'insensitive' };
    }

    if (propStatus) {
        where.status = propStatus;
    } else {
        where.status = 'APPROVED'; // Default for marketplace
    }

    if (isTrending === 'true') {
        where.isTrending = true;
    }

    const result = await prisma.property.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        include: {
            _count: { select: { investments: true } }
        }
    });

    return result;
};

/**
 * Get single property details
 */
const getSingleProperty = async (id: string) => {
    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            investments: {
                include: { user: { select: { name: true, avatar: true } } }
            },
            reviews: {
                include: { user: { select: { name: true, avatar: true } } },
                orderBy: { createdAt: 'desc' }
            }
        },
    });

    if (!property) {
        throw new AppError(status.NOT_FOUND, 'Property listing not found');
    }

    return property;
};

/**
 * Update property listing
 */
const updateProperty = async (id: string, payload: any) => {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) throw new AppError(status.NOT_FOUND, 'Property not found');

    return await prisma.property.update({
        where: { id },
        data: payload,
    });
};

/**
 * Delete property listing
 */
const deleteProperty = async (id: string) => {
    return await prisma.property.delete({ where: { id } });
};

export const PropertyService = {
    createProperty,
    getAllProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty,
};
