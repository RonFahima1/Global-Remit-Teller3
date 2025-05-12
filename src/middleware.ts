import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// Define user roles based on the Angular application
type UserRole = 
  | 'AGENT_ADMIN' 
  | 'AGENT_USER' 
  | 'ORG_ADMIN' 
  | 'ORG_USER' 
  | 'COMPLIANCE_USER' 
  | 'USER';

// Define route access permissions
const ROUTE_PERMISSIONS: Record<string, {
  roles: UserRole[];
  permissions?: string[];
}> = {
  // Dashboard routes
  '/dashboard': {
    roles: ['AGENT_ADMIN', 'AGENT_USER', 'ORG_ADMIN', 'ORG_USER', 'COMPLIANCE_USER'],
  },
  
  // Client management routes
  '/clients': {
    roles: ['AGENT_ADMIN', 'AGENT_USER', 'ORG_ADMIN', 'ORG_USER', 'COMPLIANCE_USER'],
    permissions: ['client.view'],
  },
  '/clients/new': {
    roles: ['AGENT_ADMIN', 'AGENT_USER'],
    permissions: ['client.create'],
  },
  
  // Transaction routes
  '/send-money': {
    roles: ['AGENT_ADMIN', 'AGENT_USER'],
    permissions: ['remittance.create'],
  },
  '/transactions': {
    roles: ['AGENT_ADMIN', 'AGENT_USER', 'ORG_ADMIN', 'ORG_USER', 'COMPLIANCE_USER'],
    permissions: ['transaction.view'],
  },
  
  // Exchange routes
  '/currency-exchange': {
    roles: ['AGENT_ADMIN', 'AGENT_USER'],
    permissions: ['exchange.create', 'exchange.view'],
  },
  
  // Cash register routes
  '/cash-register': {
    roles: ['AGENT_ADMIN', 'AGENT_USER'],
    permissions: ['cash_register.view'],
  },
  
  // Admin routes
  '/admin': {
    roles: ['AGENT_ADMIN', 'ORG_ADMIN'],
  },
  
  // Settings routes
  '/settings': {
    roles: ['AGENT_ADMIN', 'ORG_ADMIN'],
    permissions: ['settings.manage'],
  },
  
  // Compliance routes
  '/kyc': {
    roles: ['COMPLIANCE_USER', 'AGENT_ADMIN'],
    permissions: ['compliance.view', 'compliance.manage'],
  },
  
  // Profile routes
  '/profile': {
    roles: ['AGENT_ADMIN', 'AGENT_USER', 'ORG_ADMIN', 'ORG_USER', 'COMPLIANCE_USER', 'USER'],
    permissions: ['profile.view'],
  },
};

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'AGENT_ADMIN': [
    'remittance.create', 'remittance.view', 'remittance.edit',
    'client.create', 'client.view', 'client.edit',
    'transaction.view', 'transaction.cancel',
    'exchange.create', 'exchange.view',
    'cash_register.manage', 'cash_register.view',
    'branch.manage', 'branch.view',
    'user.create', 'user.view', 'user.edit', 'user.delete',
    'report.view', 'report.export'
  ],
  'AGENT_USER': [
    'remittance.create', 'remittance.view',
    'client.create', 'client.view', 'client.edit',
    'transaction.view',
    'exchange.create', 'exchange.view',
    'cash_register.view'
  ],
  'ORG_ADMIN': [
    'remittance.view', 'remittance.edit',
    'client.view',
    'transaction.view', 'transaction.cancel',
    'exchange.view',
    'agent.manage', 'agent.view',
    'branch.manage', 'branch.view',
    'user.create', 'user.view', 'user.edit', 'user.delete',
    'report.view', 'report.export',
    'settings.manage'
  ],
  'ORG_USER': [
    'remittance.view',
    'client.view',
    'transaction.view',
    'exchange.view',
    'agent.view',
    'branch.view',
    'report.view', 'report.export'
  ],
  'COMPLIANCE_USER': [
    'client.view',
    'transaction.view',
    'compliance.manage', 'compliance.view',
    'report.view', 'report.export'
  ],
  'USER': [
    'profile.view', 'profile.edit'
  ]
};

// Helper function to check if a user has permission to access a route
function hasRouteAccess(pathname: string, userRole: UserRole): boolean {
  // Find the most specific route configuration that matches the pathname
  const matchingRoute = Object.keys(ROUTE_PERMISSIONS)
    .filter(route => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchingRoute) return false;
  
  const routeConfig = ROUTE_PERMISSIONS[matchingRoute];
  
  // Check if user role is allowed
  if (!routeConfig.roles.includes(userRole)) return false;
  
  // If no specific permissions are required, role check is sufficient
  if (!routeConfig.permissions || routeConfig.permissions.length === 0) return true;
  
  // Check if user has at least one of the required permissions
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return routeConfig.permissions.some(permission => userPermissions.includes(permission));
}

export function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return null;
  }

  const isAuthPage = request.nextUrl.pathname === "/login";
  const authToken = request.cookies.get('auth_token')?.value;
  
  // If no token and not on login page, redirect to login
  if (!authToken && !isAuthPage && !request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If token exists and on login page, redirect to dashboard
  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // For API routes, we'll handle auth in the API handlers
  if (request.nextUrl.pathname.startsWith('/api')) {
    return null;
  }
  
  // For protected routes, check permissions
  if (authToken && !isAuthPage) {
    try {
      // Decode the token to get user data
      const decoded = jwtDecode<{
        sub: string;
        role: UserRole;
        exp: number;
      }>(authToken);
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // Check if user has permission to access the route
      const hasAccess = hasRouteAccess(request.nextUrl.pathname, decoded.role);
      if (!hasAccess) {
        // Redirect to dashboard or unauthorized page
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return null;
}

// Protect all routes except public ones
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};