import { betterAuth } from 'better-auth';
import { jwt, bearer } from 'better-auth/plugins';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || 'super-secret-jwt-key-for-lms-platform-2026',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [
    jwt({
      jwt: {
        expirationTime: '7d',
      },
    }),
    bearer(),
  ],
});

