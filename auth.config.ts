import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
