import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema for currency rate creation/update
const currencyRateSchema = z.object({
  fromCurrency: z.string().min(3, 'From currency code must be at least 3 characters'),
  toCurrency: z.string().min(3, 'To currency code must be at least 3 characters'),
  rate: z.number().positive('Rate must be positive'),
  buyRate: z.number().positive('Buy rate must be positive').optional(),
  sellRate: z.number().positive('Sell rate must be positive').optional(),
  effectiveDate: z.string().optional(),
  expiryDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET handler to retrieve all currency rates or filter by currency
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fromCurrency = searchParams.get('from') || undefined;
    const toCurrency = searchParams.get('to') || undefined;
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    // Build where conditions
    let where: any = {};
    
    if (fromCurrency) {
      where.fromCurrency = fromCurrency;
    }
    
    if (toCurrency) {
      where.toCurrency = toCurrency;
    }
    
    if (activeOnly) {
      where.isActive = true;
    }
    
    // Fetch currency rates
    const rates = await prisma.currencyRate.findMany({
      where,
      orderBy: [
        { fromCurrency: 'asc' },
        { toCurrency: 'asc' },
      ],
    });
    
    return NextResponse.json(rates);
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler to create a new currency rate
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = currencyRateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const rateData = result.data;
    
    // Convert string dates to Date objects if provided
    const effectiveDate = rateData.effectiveDate ? new Date(rateData.effectiveDate) : new Date();
    const expiryDate = rateData.expiryDate ? new Date(rateData.expiryDate) : null;
    
    // Check if a rate already exists for this currency pair
    const existingRate = await prisma.currencyRate.findFirst({
      where: {
        fromCurrency: rateData.fromCurrency,
        toCurrency: rateData.toCurrency,
      },
    });
    
    let rate;
    
    if (existingRate) {
      // Update existing rate
      rate = await prisma.currencyRate.update({
        where: {
          id: existingRate.id,
        },
        data: {
          rate: rateData.rate,
          buyRate: rateData.buyRate || rateData.rate,
          sellRate: rateData.sellRate || rateData.rate,
          effectiveDate,
          expiryDate,
          isActive: rateData.isActive ?? true,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new rate
      rate = await prisma.currencyRate.create({
        data: {
          fromCurrency: rateData.fromCurrency,
          toCurrency: rateData.toCurrency,
          rate: rateData.rate,
          buyRate: rateData.buyRate || rateData.rate,
          sellRate: rateData.sellRate || rateData.rate,
          effectiveDate,
          expiryDate,
          isActive: rateData.isActive ?? true,
        },
      });
    }
    
    return NextResponse.json(rate, { status: existingRate ? 200 : 201 });
  } catch (error) {
    console.error('Error creating/updating currency rate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
