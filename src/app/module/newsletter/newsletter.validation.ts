import { z } from 'zod';

const subscribeSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    }),
});

export const NewsletterValidation = {
    subscribeSchema,
};
