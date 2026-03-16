import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from './app/lib/passport';
import { envVars } from './app/config/env';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
import { IndexRoutes } from './app/routes';
import { handleStripeWebhook } from './app/utils/stripeWebhook';

const app: Express = express();

// Middleware
app.use(cors({
    origin: [envVars.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
}));

// Stripe Webhook needs raw body, must come before express.json()
app.post('/api/v1/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    try {
        const result = await handleStripeWebhook(sig, req.body);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

if (envVars.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/v1', IndexRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'PropShare API is running',
        version: '1.0.0',
    });
});

// Error Handling
app.use(notFound);
app.use(globalErrorHandler);

export default app;
