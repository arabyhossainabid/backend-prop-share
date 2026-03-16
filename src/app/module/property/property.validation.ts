import { z } from 'zod';

const create = z.object({
    body: z.object({
        title: z.string().min(3, 'Title is too short'),
        description: z.string().min(10, 'Description is too short'),
        location: z.string().min(3, 'Location is required'),
        pricePerShare: z.number().positive(),
        totalShares: z.number().int().positive(),
        images: z.array(z.string()).min(1),
        expectedReturn: z.number(),
    }),
});

const update = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        pricePerShare: z.number().positive().optional(),
        totalShares: z.number().int().positive().optional(),
        images: z.array(z.string()).optional(),
        expectedReturn: z.number().optional(),
        status: z.enum(['PENDING', 'APPROVED', 'SOLD']).optional(),
        isTrending: z.boolean().optional(),
    }),
});

export const PropertyValidation = {
    create,
    update,
};
