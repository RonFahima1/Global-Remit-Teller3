import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema for cash register session creation
const cashRegisterOpenSchema = z.object({
  initialBalance: z.record(z.number().min(0, 'Balance cannot be negative')),
  branchId: z.string().min(1, 'Branch ID is required'),
});

// Define validation schema for cash register session closure
const cashRegisterCloseSchema = z.object({
  currentBalance: z.record(z.number().min(0, 'Balance cannot be negative')),
  notes: z.string().optional(),
});

// GET handler to retrieve cash register sessions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build where conditions
    let where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }
    
    // Count total sessions matching the criteria
    const totalCount = await prisma.cashRegister.count({ where });
    
    // Fetch cash register sessions with pagination
    const sessions = await prisma.cashRegister.findMany({
      where,
      skip,
      take: limit,
      orderBy: { openedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      sessions,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cash register sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler to open a new cash register session
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = cashRegisterOpenSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { initialBalance, branchId } = result.data;
    
    // Get user ID from auth token (in a real implementation)
    // For now, we'll use a mock user ID
    const userId = 'user-001';
    
    // Check if user already has an open cash register session
    const existingSession = await prisma.cashRegister.findFirst({
      where: {
        userId,
        status: 'OPEN',
      },
    });
    
    if (existingSession) {
      return NextResponse.json(
        { error: 'User already has an open cash register session' },
        { status: 400 }
      );
    }
    
    // Create new cash register session
    const session = await prisma.cashRegister.create({
      data: {
        userId,
        branchId,
        status: 'OPEN',
        initialBalance,
        currentBalance: initialBalance,
        openedAt: new Date(),
      },
    });
    
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error opening cash register session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
