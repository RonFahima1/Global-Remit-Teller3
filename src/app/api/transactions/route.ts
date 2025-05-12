import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema for transaction creation
const transactionSchema = z.object({
  type: z.enum(['REMITTANCE', 'EXCHANGE', 'DEPOSIT', 'WITHDRAWAL']),
  sendAmount: z.number().positive('Send amount must be positive'),
  receiveAmount: z.number().positive('Receive amount must be positive'),
  fee: z.number().min(0, 'Fee cannot be negative'),
  exchangeRate: z.number().optional(),
  sendCurrency: z.string().min(1, 'Send currency is required'),
  receiveCurrency: z.string().min(1, 'Receive currency is required'),
  senderId: z.string().min(1, 'Sender ID is required'),
  receiverId: z.string().optional(),
  payoutMethod: z.string().min(1, 'Payout method is required'),
  payoutDetails: z.record(z.any()).optional(),
  notes: z.string().optional(),
});

// Helper function to generate a unique reference number
function generateReference(): string {
  const prefix = 'TRX';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
}

// GET handler to retrieve transactions with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build where conditions
    let where: any = {};
    
    // Add type filter if provided
    if (type) {
      where.type = type;
    }
    
    // Add status filter if provided
    if (status) {
      where.status = status;
    }
    
    // Add date range filter if provided
    if (startDate || endDate) {
      where.createdAt = {};
      
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      
      if (endDate) {
        // Set end date to end of day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }
    
    // Add search query if provided
    if (query) {
      where.OR = [
        { reference: { contains: query } },
        { sender: { firstName: { contains: query, mode: 'insensitive' } } },
        { sender: { lastName: { contains: query, mode: 'insensitive' } } },
        { receiver: { firstName: { contains: query, mode: 'insensitive' } } },
        { receiver: { lastName: { contains: query, mode: 'insensitive' } } },
      ];
    }
    
    // Count total transactions matching the criteria
    const totalCount = await prisma.transaction.count({ where });
    
    // Fetch transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        operator: {
          select: {
            id: true,
            name: true,
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
      transactions,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler to create a new transaction
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = transactionSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const transactionData = result.data;
    
    // Get user ID from auth token (in a real implementation)
    // For now, we'll use a mock user ID
    const operatorId = 'operator-001';
    const branchId = 'branch-001';
    
    // Generate a unique reference number
    const reference = generateReference();
    
    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        reference,
        type: transactionData.type,
        status: 'PENDING',
        amount: transactionData.sendAmount,
        fee: transactionData.fee,
        exchangeRate: transactionData.exchangeRate,
        sendCurrency: transactionData.sendCurrency,
        receiveCurrency: transactionData.receiveCurrency,
        sendAmount: transactionData.sendAmount,
        receiveAmount: transactionData.receiveAmount,
        senderId: transactionData.senderId,
        receiverId: transactionData.receiverId,
        operatorId,
        branchId,
        payoutMethod: transactionData.payoutMethod,
        payoutDetails: transactionData.payoutDetails || {},
        notes: transactionData.notes,
      },
    });
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
