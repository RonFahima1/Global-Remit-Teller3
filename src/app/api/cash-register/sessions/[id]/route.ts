import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema for cash register session closure
const cashRegisterCloseSchema = z.object({
  currentBalance: z.record(z.number().min(0, 'Balance cannot be negative')),
  notes: z.string().optional(),
});

// Define validation schema for cash movement
const cashMovementSchema = z.object({
  type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'ADJUSTMENT']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  reference: z.string().optional(),
  description: z.string().optional(),
});

// GET handler to retrieve a cash register session by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch cash register session with related data
    const session = await prisma.cashRegister.findUnique({
      where: { id },
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
        cashMovements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Cash register session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(session);
  } catch (error) {
    console.error(`Error fetching cash register session ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH handler to close a cash register session
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if session exists
    const existingSession = await prisma.cashRegister.findUnique({
      where: { id },
    });
    
    if (!existingSession) {
      return NextResponse.json(
        { error: 'Cash register session not found' },
        { status: 404 }
      );
    }
    
    // Check if session is already closed
    if (existingSession.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'Cash register session is already closed' },
        { status: 400 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const result = cashRegisterCloseSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { currentBalance, notes } = result.data;
    
    // Close the cash register session
    const closedSession = await prisma.cashRegister.update({
      where: { id },
      data: {
        status: 'CLOSED',
        currentBalance,
        closedAt: new Date(),
        notes,
      },
    });
    
    return NextResponse.json(closedSession);
  } catch (error) {
    console.error(`Error closing cash register session ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler to add a cash movement to a session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if session exists
    const existingSession = await prisma.cashRegister.findUnique({
      where: { id },
    });
    
    if (!existingSession) {
      return NextResponse.json(
        { error: 'Cash register session not found' },
        { status: 404 }
      );
    }
    
    // Check if session is open
    if (existingSession.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Cannot add movement to a closed cash register session' },
        { status: 400 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const result = cashMovementSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const movementData = result.data;
    
    // Get user ID from auth token (in a real implementation)
    // For now, we'll use a mock user ID
    const createdBy = 'user-001';
    
    // Create the cash movement
    const movement = await prisma.cashMovement.create({
      data: {
        registerId: id,
        type: movementData.type,
        amount: movementData.amount,
        currency: movementData.currency,
        reference: movementData.reference,
        description: movementData.description,
        createdBy,
      },
    });
    
    // Update the current balance of the cash register
    const currentBalance = { ...existingSession.currentBalance as Record<string, number> };
    const currency = movementData.currency;
    
    // Initialize the currency balance if it doesn't exist
    if (!currentBalance[currency]) {
      currentBalance[currency] = 0;
    }
    
    // Update the balance based on the movement type
    if (movementData.type === 'DEPOSIT') {
      currentBalance[currency] += movementData.amount;
    } else if (movementData.type === 'WITHDRAWAL') {
      currentBalance[currency] -= movementData.amount;
      
      // Ensure balance doesn't go negative
      if (currentBalance[currency] < 0) {
        currentBalance[currency] = 0;
      }
    } else if (movementData.type === 'ADJUSTMENT') {
      // For adjustments, the amount can be positive or negative
      currentBalance[currency] += movementData.amount;
    }
    
    // Update the cash register with the new balance
    await prisma.cashRegister.update({
      where: { id },
      data: {
        currentBalance,
      },
    });
    
    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    console.error(`Error adding cash movement to session ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
