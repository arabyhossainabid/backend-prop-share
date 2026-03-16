import { z } from 'zod';

const purchase = z.object({
    body: z.object({
        propertyId: z.string().cuid('Invalid property ID'),
        shares: z.number().int().positive('Shares must be at least 1'),
    }),
});

export const InvestmentValidation = {
    purchase,
};
