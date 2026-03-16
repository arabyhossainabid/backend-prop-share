import { z } from 'zod';

const updateUser = z.object({
    body: z.object({
        role: z.enum(['ADMIN', 'USER']).optional(),
        isActive: z.boolean().optional(),
    }),
});

const reviewProperty = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'APPROVED', 'SOLD']),
    }),
});

export const AdminValidation = {
    updateUser,
    reviewProperty,
};
