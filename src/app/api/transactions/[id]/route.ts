import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema for transaction update
const transactionUpdateSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
  receiptUrl: z.string().optional(),
});

// GET handler to retrieve a transaction by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch transaction with related data
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
        operator: {
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
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error(`Error fetching transaction ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH handler to update a transaction
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });
    
    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const result = transactionUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const updateData = result.data;
    
    // If status is being updated to COMPLETED, set completedAt
    if (updateData.status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }
    
    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });
    
    // If transaction is completed, update client account balances
    if (updateData.status === 'COMPLETED' && !existingTransaction.completedAt) {
      // This would be implemented in a real application
      // For now, we'll just log it
      console.log(`Transaction ${id} completed. Updating account balances would happen here.`);
      
      // In a real implementation, this would be a transaction to ensure atomicity
      // await prisma.$transaction([...account balance updates...])
    }
    
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error(`Error updating transaction ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler to cancel a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });
    
    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    // Check if transaction can be cancelled
    if (existingTransaction.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel a completed transaction' },
        { status: 400 }
      );
    }
    
    // Update transaction status to CANCELLED
    const cancelledTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: existingTransaction.notes 
          ? `${existingTransaction.notes}\nCancelled on ${new Date().toISOString()}`
          : `Cancelled on ${new Date().toISOString()}`,
      },
    });
    
    return NextResponse.json({
      message: 'Transaction cancelled successfully',
      transaction: cancelledTransaction,
    });
  } catch (error) {
    console.error(`Error cancelling transaction ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
