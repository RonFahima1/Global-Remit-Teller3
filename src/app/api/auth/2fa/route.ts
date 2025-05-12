import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const prisma = new PrismaClient();

// Define validation schema for 2FA setup
const setupSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

// Define validation schema for 2FA verification
const verifySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(1, 'Verification token is required'),
});

// JWT secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Setup 2FA
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = setupSchema.safeParse(body);
    
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
    
    const { userId } = result.data;
    
    // In a real application, you would:
    // 1. Check if the user exists in the database
    // 2. Generate a secret key for the user
    // 3. Save the secret key to the database
    // 4. Generate a QR code for the user to scan
    
    // Generate a secret key
    const secret = speakeasy.generateSecret({
      name: `Global Remit (${userId})`,
      issuer: 'Global Remit'
    });
    
    // Generate a QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url || '');
    
    // In a real application, you would save the secret.base32 to the database
    // For now, we'll just return the secret and QR code in the response
    
    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
    
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during 2FA setup' },
      { status: 500 }
    );
  }
}

// Verify 2FA token
export async function PUT(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = verifySchema.safeParse(body);
    
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
    
    const { userId, token } = result.data;
    
    // In a real application, you would:
    // 1. Get the user's secret key from the database
    // 2. Verify the token using the secret key
    
    // For now, we'll mock this behavior
    // In a real application, you would get the secret from the database
    const secret = 'MOCK_SECRET_KEY';
    
    // Verify the token
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1 // Allow 1 time step before and after the current time
    });
    
    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code' },
        { status: 401 }
      );
    }
    
    // In a real application, you would:
    // 1. Update the user's 2FA status in the database
    // 2. Generate a new access token with 2FA verified
    
    // Generate a new access token
    const accessToken = jwt.sign(
      { 
        sub: userId,
        twoFactorVerified: true
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return NextResponse.json({
      success: true,
      message: '2FA verification successful',
      accessToken
    });
    
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during 2FA verification' },
      { status: 500 }
    );
  }
}
