import { z } from 'zod';

const create = z.object({
    body: z.object({
        propertyId: z.string().cuid(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().min(5, 'Review is too short'),
    }),
});

export const ReviewValidation = {
    create,
};
