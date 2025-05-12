import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema for client creation/update
const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().nullable(),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional().nullable(),
  idType: z.string().optional().nullable(),
  idNumber: z.string().optional().nullable(),
  idExpiryDate: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  employerName: z.string().optional().nullable(),
  monthlyIncome: z.number().optional().nullable(),
  sourceOfFunds: z.string().optional().nullable(),
});

// GET handler to retrieve all clients or search by parameters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build search conditions
    const where = query
      ? {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { phoneNumber: { contains: query } },
            { idNumber: { contains: query } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};
    
    // Count total clients matching the search criteria
    const totalCount = await prisma.client.count({ where });
    
    // Fetch clients with pagination
    const clients = await prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        country: true,
        kycStatus: true,
        createdAt: true,
        profileImage: true,
      },
    });
    
    return NextResponse.json({
      clients,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler to create a new client
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = clientSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const clientData = result.data;
    
    // Convert string dates to Date objects if provided
    const dateOfBirth = clientData.dateOfBirth ? new Date(clientData.dateOfBirth) : null;
    const idExpiryDate = clientData.idExpiryDate ? new Date(clientData.idExpiryDate) : null;
    
    // Create the client
    const client = await prisma.client.create({
      data: {
        ...clientData,
        dateOfBirth,
        idExpiryDate,
        kycStatus: 'PENDING',
      },
    });
    
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}