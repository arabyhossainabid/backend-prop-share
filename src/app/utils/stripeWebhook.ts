import Stripe from 'stripe';
import { envVars } from '../config/env';
import { prisma } from '../lib/prisma';

const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

/**
 * Global Webhook Handler (Mainly for Investments)
 */
export const handleStripeWebhook = async (sig: string, payload: any) => {
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, envVars.STRIPE.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, propertyId, shares, totalAmount, type } = session.metadata as any;

        if (type === 'INVESTMENT') {
            await prisma.$transaction(async (tx) => {
                // Find existing investment to get ID for upsert-like behavior on a non-unique combination if needed
                const existingInvestment = await tx.investment.findFirst({
                    where: { userId, propertyId }
                });

                let investment;
                if (existingInvestment) {
                    investment = await tx.investment.update({
                        where: { id: existingInvestment.id },
                        data: {
                            sharesBought: { increment: parseInt(shares) },
                            totalAmount: { increment: parseFloat(totalAmount) }
                        }
                    });
                } else {
                    investment = await tx.investment.create({
                        data: {
                            userId,
                            propertyId,
                            sharesBought: parseInt(shares),
                            totalAmount: parseFloat(totalAmount)
                        }
                    });
                }

                // 2. Reduce Available Shares from Property
                await tx.property.update({
                    where: { id: propertyId },
                    data: { availableShares: { decrement: parseInt(shares) } }
                });

                // 3. Record Transaction
                await tx.transaction.create({
                    data: {
                        userId,
                        investmentId: investment.id,
                        amount: parseFloat(totalAmount),
                        stripePaymentId: session.id, // Using session ID
                        status: 'SUCCESS',
                        type: 'INVESTMENT'
                    }
                });
            });
            console.log(`Investment Confirmed for User ${userId}`);
        }
    }

    return { received: true };
};
