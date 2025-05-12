# Authentication System Documentation

## Overview

The Global Remit Teller application implements a comprehensive authentication system with two primary authentication methods:

1. **Microsoft 365 SSO (Primary)**: Allows users to sign in using their Microsoft 365 accounts
2. **Email/Password (Fallback)**: Traditional authentication method as a fallback option

This dual-authentication approach provides flexibility while leveraging the security and convenience of Microsoft's identity platform.

## Architecture

The authentication system consists of the following components:

### 1. NextAuth.js Integration

We use NextAuth.js (Auth.js) as the foundation for our authentication system, which provides:

- Multiple authentication providers support
- Session management
- JWT handling
- Secure token storage

### 2. Authentication API Routes

The following API routes handle authentication requests:

- `/api/auth/[...nextauth]`: NextAuth.js API routes for handling authentication requests
- `/api/auth/login`: Traditional login endpoint
- `/api/auth/logout`: Logout endpoint
- `/api/auth/refresh`: Token refresh endpoint
- `/api/auth/register`: User registration endpoint
- `/api/auth/reset-password`: Password reset endpoint
- `/api/auth/2fa`: Two-factor authentication endpoint

### 3. Authentication Context

The authentication context provides authentication state and functions to the entire application:

- `AuthProvider`: Combines NextAuth.js session provider with our custom auth context
- `useAuth`: Custom hook for accessing authentication functions and state

## Authentication Flow

### Microsoft 365 SSO Flow

1. User clicks "Sign in with Microsoft" button
2. User is redirected to Microsoft login page
3. User authenticates with Microsoft credentials
4. Microsoft redirects back to our application with an authorization code
5. NextAuth.js exchanges the code for access and ID tokens
6. User is authenticated and redirected to the dashboard

### Fallback Authentication Flow

1. User enters email and password
2. Credentials are validated against the database
3. If valid, JWT tokens are generated and stored
4. User is authenticated and redirected to the dashboard

## Role Management

Even when using Microsoft 365 SSO, roles are managed within our application:

1. When a user signs in with Microsoft for the first time, they are assigned a default role
2. Administrators can modify user roles through the application
3. Optionally, roles can be mapped from Microsoft Groups to application roles

## Configuration

### Environment Variables

The following environment variables are required for authentication:

```
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Microsoft Azure AD Configuration
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-client-secret
AZURE_AD_TENANT_ID=your-azure-tenant-id
```

### Microsoft Azure AD Setup

To configure Microsoft 365 SSO:

1. Register a new application in the Azure Portal
2. Set the redirect URI to `{your-domain}/api/auth/callback/azure-ad`
3. Grant the following permissions:
   - `openid`
   - `profile`
   - `email`
   - `User.Read`
   - `GroupMember.Read.All` (if using group-based role mapping)
4. Create a client secret
5. Update the environment variables with the client ID, client secret, and tenant ID

## Security Considerations

- All authentication requests use HTTPS
- JWT tokens are stored securely and include expiration times
- Refresh tokens are used to maintain sessions without requiring frequent re-authentication
- Password reset tokens are short-lived and single-use
- Failed login attempts are rate-limited
- All authentication events are logged for audit purposes

## Extending the Authentication System

### Adding Additional Authentication Providers

To add a new authentication provider:

1. Install the required NextAuth.js provider package
2. Add the provider to the NextAuth.js configuration in `/api/auth/[...nextauth]/route.ts`
3. Update the login UI to include the new provider

### Customizing User Roles and Permissions

The role-based permission system can be extended by:

1. Adding new roles to the `UserRole` type in `auth-provider.tsx`
2. Updating the `ROLE_PERMISSIONS` mapping with permissions for the new role
3. Implementing role mapping from Microsoft Groups if needed
