import Stripe from 'stripe';
import { envVars } from '../../config/env';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import status from 'http-status';

const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

/**
 * Buy shares in a property
 */
const purchaseShares = async (userId: string, payload: { propertyId: string, shares: number }) => {
    const { propertyId, shares } = payload;

    // 1. Validate property
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.status !== 'APPROVED') {
        throw new AppError(status.NOT_FOUND, 'Property not available for investment');
    }

    // 2. Check share availability
    if (property.availableShares < shares) {
        throw new AppError(status.BAD_REQUEST, `Only ${property.availableShares} shares available`);
    }

    const totalAmount = property.pricePerShare * shares;

    // 3. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Investment in ${property.title}`,
                    description: `Buying ${shares} shares at $${property.pricePerShare} each`,
                },
                unit_amount: Math.round(totalAmount * 100),
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: `${envVars.FRONTEND_URL}/dashboard/investments?success=true`,
        cancel_url: `${envVars.FRONTEND_URL}/properties/${propertyId}?success=false`,
        metadata: {
            userId,
            propertyId,
            shares: shares.toString(),
            totalAmount: totalAmount.toString(),
            type: 'INVESTMENT'
        },
    });

    return { checkoutUrl: session.url };
};

/**
 * Get user's investment portfolio
 */
const getMyInvestments = async (userId: string) => {
    return await prisma.investment.findMany({
        where: { userId },
        include: {
            property: true,
            transactions: true
        }
    });
};

export const InvestmentService = {
    purchaseShares,
    getMyInvestments
};
