import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema for client update
const clientUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email').optional().nullable(),
  phoneNumber: z.string().min(1, 'Phone number is required').optional(),
  dateOfBirth: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().min(1, 'Country is required').optional(),
  postalCode: z.string().optional().nullable(),
  idType: z.string().optional().nullable(),
  idNumber: z.string().optional().nullable(),
  idExpiryDate: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  employerName: z.string().optional().nullable(),
  monthlyIncome: z.number().optional().nullable(),
  sourceOfFunds: z.string().optional().nullable(),
  kycStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

// GET handler to retrieve a client by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Fetch client with documents
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        documents: true,
        clientAccounts: true,
      },
    });
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(client);
  } catch (error) {
    console.error(`Error fetching client ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH handler to update a client
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });
    
    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const result = clientUpdateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const clientData = result.data;
    
    // Convert string dates to Date objects if provided
    const dateOfBirth = clientData.dateOfBirth ? new Date(clientData.dateOfBirth) : undefined;
    const idExpiryDate = clientData.idExpiryDate ? new Date(clientData.idExpiryDate) : undefined;
    
    // Update the client
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        ...clientData,
        dateOfBirth,
        idExpiryDate,
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error(`Error updating client ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });
    
    if (!existingClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Delete the client's documents first
    await prisma.document.deleteMany({
      where: { clientId: id },
    });
    
    // Delete the client's accounts
    await prisma.clientAccount.deleteMany({
      where: { clientId: id },
    });
    
    // Delete the client
    await prisma.client.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Client deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting client ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
