import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import AppError from '../errorHelpers/AppError';
import { auth } from '../lib/betterAuth';

/**
 * Optional BetterAuth session middleware.
 * Validates BetterAuth session token from Authorization header.
 * Attaches user and session to request if valid.
 * Continues to next middleware even if no session is found.
 *
 * Usage: Use for public routes that optionally accept authenticated users.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const checkBetterAuthSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.replace('Bearer ', '');

    // If no token found, proceed as anonymous user
    if (!sessionToken) {
      return next();
    }

    // Verify session using BetterAuth
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    // Attach session and user to request if valid
    if (session?.user) {
      (req as any).user = session.user;
      (req as any).session = session.session;
    }

    next();
  } catch (error) {
    // Log error but continue - this is optional authentication
    next();
  }
};

/**
 * Required BetterAuth session middleware.
 * Validates BetterAuth session and returns 401 if invalid or missing.
 * Attaches user and session to request for downstream handlers.
 *
 * Usage: Use for protected routes that require authentication.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws AppError with status 401 if session is invalid
 */
export const requireBetterAuthSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verify session using BetterAuth API
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    // Reject if no valid session found
    if (!session?.user) {
      throw new AppError(
        status.UNAUTHORIZED,
        'Unauthorized access! No valid session found.'
      );
    }

    // Attach user and session context for downstream handlers
    (req as any).user = session.user;
    (req as any).session = session.session;

    next();
  } catch (error: any) {
    // Pass error to global error handler
    next(
      error instanceof AppError
        ? error
        : new AppError(status.UNAUTHORIZED, 'Invalid session')
    );
  }
};
