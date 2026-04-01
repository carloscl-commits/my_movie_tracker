import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Check DB credentials first
        try {
          const dbCredentials = await prisma.userCredentials.findUnique({
            where: { id: 1 },
          });

          if (dbCredentials) {
            const isValid = await bcrypt.compare(
              credentials.password as string,
              dbCredentials.passwordHash
            );
            if (
              credentials.username === dbCredentials.username &&
              isValid
            ) {
              return {
                id: '1',
                name: 'Owner',
                email: 'owner@movietracker.local',
              };
            }
            return null;
          }
        } catch {
          // DB not available, fall through to env vars
        }

        // Fallback to env vars
        const username = process.env.AUTH_USERNAME;
        const password = process.env.AUTH_PASSWORD;

        if (
          credentials.username === username &&
          credentials.password === password
        ) {
          return {
            id: '1',
            name: 'Owner',
            email: 'owner@movietracker.local',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token }: any) {
      return token;
    },
    async session({ session }: any) {
      return session;
    },
  },
};

export const handler = NextAuth(authConfig);
