import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';

const prisma = new PrismaClient();

// Define validation schema for login request
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Define user roles
type UserRole = 
  | 'AGENT_ADMIN' 
  | 'AGENT_USER' 
  | 'ORG_ADMIN' 
  | 'ORG_USER' 
  | 'COMPLIANCE_USER' 
  | 'USER';

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

// Generate JWT token
function generateToken(user: any): string {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    branchId: user.branchId,
    agentId: user.agentId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  };
  
  // In a real app, we would use a proper JWT library with a secret key
  // For now, we'll use a simple base64 encoding for the mock implementation
  return btoa(JSON.stringify(payload));
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        branchId: true,
        agentId: true,
        status: true,
        failedAttempts: true,
        lastLogin: true,
        profileImage: true,
      },
    });
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check if account is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment failed attempts
      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: user.failedAttempts + 1 },
      });
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Reset failed attempts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        failedAttempts: 0,
        lastLogin: new Date(),
      },
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Create user data with permissions
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      branchId: user.branchId,
      agentId: user.agentId,
      profileImage: user.profileImage,
      status: user.status,
      lastLogin: user.lastLogin,
      permissions: ROLE_PERMISSIONS[user.role as UserRole] || [],
    };
    
    // Set cookie with token
    const response = NextResponse.json({ user: userData }, { status: 200 });
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
