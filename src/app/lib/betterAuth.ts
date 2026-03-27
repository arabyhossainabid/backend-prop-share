import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { envVars } from '../config/env';
import { prisma } from './prisma';

/**
 * Better Auth instance configured with Prisma adapter.
 * Provides unified authentication for email/password and OAuth flows.
 *
 * Features:
 * - Session management with secure tokens
 * - Email/password authentication
 * - Google OAuth provider
 * - User account linking
 * - Email verification support
 */
export const auth = betterAuth({
  // Prisma database adapter for storing sessions and user data
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // Secret key for signing tokens and sessions
  secret: envVars.BETTER_AUTH_SECRET,
  // Base URL for auth service
  baseURL: envVars.BETTER_AUTH_URL,
  // Base path where auth routes are mounted
  basePath: '/api/v1/auth',
  // Trusted origins for CORS and redirects
  trustedOrigins: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
  // OAuth providers configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
});

// Export session type for use in other parts of the app
export type Session = typeof auth.$Infer.Session;

