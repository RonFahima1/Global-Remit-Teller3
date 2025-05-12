import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Role mapping from Microsoft Groups to application roles
const MS_GROUP_TO_ROLE_MAP: Record<string, string> = {
  'Global-Remit-Admins': 'AGENT_ADMIN',
  'Global-Remit-Users': 'AGENT_USER',
  'Global-Remit-Org-Admins': 'ORG_ADMIN',
  'Global-Remit-Org-Users': 'ORG_USER',
  'Global-Remit-Compliance': 'COMPLIANCE_USER',
};

// JWT secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Microsoft provider for SSO
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
      tenantId: process.env.AZURE_AD_TENANT_ID || '',
      authorization: {
        params: {
          scope: 'openid profile email User.Read GroupMember.Read.All',
        },
      },
    }),
    
    // Credentials provider for fallback authentication
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          
          if (!user || !user.password) {
            return null;
          }
          
          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Return user data
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error('Error during credentials authorization:', error);
          return null;
        }
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Microsoft login, fetch user groups and map to roles
      if (account?.provider === 'azure-ad' && profile) {
        try {
          // In a real implementation, you would use the Microsoft Graph API
          // to fetch the user's groups and map them to roles
          // For now, we'll assign a default role
          
          // Check if user exists in the database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email as string },
          });
          
          if (!existingUser) {
            // Create new user with Microsoft account
            await prisma.user.create({
              data: {
                email: user.email as string,
                name: user.name as string,
                role: 'USER', // Default role
                emailVerified: new Date(),
                image: user.image,
              },
            });
          }
        } catch (error) {
          console.error('Error during Microsoft sign-in:', error);
          return false;
        }
      }
      
      return true;
    },
    
    async jwt({ token, user, account }) {
      // Add custom claims to the JWT
      if (user) {
        token.role = user.role || 'USER';
        token.permissions = []; // Fetch permissions based on role
      }
      
      // For Microsoft login, add access token for Microsoft Graph API
      if (account?.provider === 'azure-ad') {
        token.accessToken = account.access_token;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Add custom session properties
      if (session.user) {
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
      }
      
      return session;
    },
  },
  
  events: {
    async signIn({ user, account, isNewUser }) {
      // Log authentication events
      console.log(`User ${user.email} signed in using ${account?.provider}`);
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
