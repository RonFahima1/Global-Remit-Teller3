import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Define validation schema for request password reset
const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Define validation schema for reset password
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// JWT secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Request password reset
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = requestResetSchema.safeParse(body);
    
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
    
    const { email } = result.data;
    
    // In a real application, you would:
    // 1. Check if the user exists in the database
    // 2. Generate a password reset token
    // 3. Save the token to the database with an expiry time
    // 4. Send an email to the user with a link containing the token
    
    // For now, we'll mock this behavior
    // Generate a password reset token
    const resetToken = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // In a real application, you would send an email with the reset link
    // For now, we'll just return the token in the response (for development only)
    
    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email',
      // Only include the token in development environment
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
    
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during password reset request' },
      { status: 500 }
    );
  }
}

// Reset password with token
export async function PUT(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);
    
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
    
    const { token, password } = result.data;
    
    try {
      // Verify the reset token
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { email: string };
      
      if (!decoded || !decoded.email) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired reset token' },
          { status: 401 }
        );
      }
      
      const email = decoded.email;
      
      // In a real application, you would:
      // 1. Check if the token exists in the database and is not expired
      // 2. Get the user from the database using the email
      // 3. Update the user's password
      // 4. Remove the reset token from the database
      
      // For now, we'll mock this behavior
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // In a real application, you would update the user's password in the database
      // For now, we'll just return a success response
      
      return NextResponse.json({
        success: true,
        message: 'Password reset successful'
      });
      
    } catch (error) {
      // Token verification failed
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during password reset' },
      { status: 500 }
    );
  }
}
