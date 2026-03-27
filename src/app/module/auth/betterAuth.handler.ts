import { NextFunction, Request, Response } from 'express';
import { auth } from '../../lib/betterAuth';

/**
 * BetterAuth request handler middleware.
 *
 * Processes all BetterAuth requests and automatically:
 * - Single sign-on (SSO) flows
 * - OAuth provider callbacks
 * - Session validation
 * - Token refresh
 *
 * BetterAuth will automatically handle routes under /api/v1/auth/:
 * - /sign-up - Create new account with email/password
 * - /sign-in - Authenticate with email/password
 * - /sign-out - Logout and clear session
 * - /session - Get current session
 * - /callback/[provider] - OAuth provider callbacks (Google, etc.)
 * - /change-password - Update user password
 * - /send-verification-email - Request email verification
 * - And more...
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const betterAuthHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Let BetterAuth handle the request - returns null if not a BetterAuth route
    const response = await auth.handler(req as any);

    // If BetterAuth handled the request, send the response
    if (response) {
      res.status(response.status || 200);
      // Apply BetterAuth response headers (includes Set-Cookie for sessions)
      Object.entries(response.headers || {}).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      // Send BetterAuth response body
      res.send(response.body);
    } else {
      // Not a BetterAuth route, pass to next middleware
      next();
    }
  } catch (error) {
    // Pass any errors to global error handler
    next(error);
  }
};
