import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Define validation schema for refresh token request
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// JWT secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = refreshTokenSchema.safeParse(body);
    
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
    
    const { refreshToken } = result.data;
    
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as jwt.JwtPayload;
      
      // Check if token is expired
      if (!decoded || !decoded.sub) {
        return NextResponse.json(
          { success: false, message: 'Invalid refresh token' },
          { status: 401 }
        );
      }
      
      // In a real application, you would:
      // 1. Check if the refresh token exists in the database and is not revoked
      // 2. Get the user from the database using decoded.sub (user ID)
      // 3. Generate new access and refresh tokens
      
      // For now, we'll mock this behavior
      const userId = decoded.sub;
      const user = {
        id: userId,
        email: decoded.email as string,
        name: decoded.name as string,
        role: decoded.role as string,
        permissions: decoded.permissions as string[],
      };
      
      // Generate new tokens
      const newAccessToken = jwt.sign(
        { 
          sub: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      const newRefreshToken = jwt.sign(
        { 
          sub: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions
        },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );
      
      // Calculate expiry time (1 hour from now)
      const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;
      
      return NextResponse.json({
        success: true,
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresAt
        }
      });
      
    } catch (error) {
      // Token verification failed
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during token refresh' },
      { status: 500 }
    );
  }
}
