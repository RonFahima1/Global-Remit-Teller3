import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define validation schema for user registration
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
  role: z.enum(['AGENT_ADMIN', 'AGENT_USER', 'ORG_ADMIN', 'ORG_USER', 'COMPLIANCE_USER', 'USER']).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request', 
          errors: result.error.errors 
        },
        { status: 400 }
      );
    }
    
    const { name, email, password, role = 'USER' } = result.data;
    
    // In a real application, you would:
    // 1. Check if the user already exists in the database
    // 2. Hash the password
    // 3. Create the user in the database
    // 4. Send a verification email
    
    try {
      // Check if user already exists
      // In a real application, you would check the database
      // For now, we'll assume the user doesn't exist
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create the user
      // In a real application, you would create the user in the database
      // For now, we'll just return a success response
      
      return NextResponse.json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: 'mock-user-id',
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        }
      });
      
    } catch (error) {
      // User already exists or other database error
      if ((error as any).code === 'P2002') {
        return NextResponse.json(
          { success: false, message: 'User with this email already exists' },
          { status: 409 }
        );
      }
      
      throw error;
    }
    
  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during user registration' },
      { status: 500 }
    );
  }
}
