/**
 * Mock Payout Partners
 * Provides mock data for payout partners
 */

import { PayoutPartner, PayoutMethod } from '@/types/payout';

/**
 * Mock Payout Partners
 */
export const mockPayoutPartners: PayoutPartner[] = [
  {
    id: '1',
    name: 'Global Transfer Network',
    code: 'GTN',
    description: 'Worldwide money transfer network with extensive coverage in Asia and Africa',
    logo: '/images/partners/gtn-logo.png',
    supportedCountries: ['IN', 'PH', 'VN', 'TH', 'ID', 'MY', 'KE', 'NG', 'GH', 'ZA'],
    supportedCurrencies: ['USD', 'EUR', 'INR', 'PHP', 'VND', 'THB', 'IDR', 'MYR', 'KES', 'NGN', 'GHS', 'ZAR'],
    supportedMethods: [
      PayoutMethod.BANK_TRANSFER,
      PayoutMethod.CASH_PICKUP,
      PayoutMethod.MOBILE_WALLET
    ],
    apiCredentials: {
      baseUrl: 'https://api.globaltransfernetwork.com/v1',
      apiKey: 'mock-api-key',
      apiSecret: 'mock-api-secret'
    },
    isActive: true,
    feeStructure: {
      fixedFee: 1.5,
      percentageFee: 0.5,
      minimumFee: 2,
      maximumFee: 20,
      currency: 'USD'
    },
    contactInfo: {
      email: 'api-support@globaltransfernetwork.com',
      phone: '+1-555-123-4567',
      website: 'https://www.globaltransfernetwork.com',
      contactPerson: 'John Smith'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-03-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'EuroPayouts',
    code: 'EUROP',
    description: 'Specialized in European money transfers with low fees',
    logo: '/images/partners/europayouts-logo.png',
    supportedCountries: ['DE', 'FR', 'IT', 'ES', 'PT', 'GR', 'NL', 'BE', 'AT', 'PL'],
    supportedCurrencies: ['EUR', 'GBP', 'CHF', 'PLN', 'CZK', 'HUF', 'SEK', 'NOK', 'DKK'],
    supportedMethods: [
      PayoutMethod.BANK_TRANSFER,
      PayoutMethod.DEBIT_CARD
    ],
    apiCredentials: {
      baseUrl: 'https://api.europayouts.eu/v2',
      username: 'mock-username',
      password: 'mock-password'
    },
    isActive: true,
    feeStructure: {
      fixedFee: 1,
      percentageFee: 0.3,
      minimumFee: 1,
      maximumFee: 10,
      currency: 'EUR'
    },
    contactInfo: {
      email: 'support@europayouts.eu',
      phone: '+44-20-1234-5678',
      website: 'https://www.europayouts.eu',
      contactPerson: 'Marie Dubois'
    },
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2025-04-05T11:45:00Z'
  },
  {
    id: '3',
    name: 'Middle East Payments',
    code: 'MEP',
    description: 'Specialized in Middle East and North Africa money transfers',
    logo: '/images/partners/mep-logo.png',
    supportedCountries: ['AE', 'SA', 'QA', 'BH', 'KW', 'OM', 'JO', 'EG', 'MA', 'TN'],
    supportedCurrencies: ['USD', 'EUR', 'AED', 'SAR', 'QAR', 'BHD', 'KWD', 'OMR', 'JOD', 'EGP', 'MAD', 'TND'],
    supportedMethods: [
      PayoutMethod.BANK_TRANSFER,
      PayoutMethod.CASH_PICKUP,
      PayoutMethod.HOME_DELIVERY
    ],
    apiCredentials: {
      baseUrl: 'https://api.middleeastpayments.com/v1',
      apiKey: 'mock-api-key',
      apiSecret: 'mock-api-secret'
    },
    isActive: true,
    feeStructure: {
      fixedFee: 2,
      percentageFee: 0.6,
      minimumFee: 3,
      maximumFee: 25,
      currency: 'USD'
    },
    contactInfo: {
      email: 'partners@middleeastpayments.com',
      phone: '+971-4-123-4567',
      website: 'https://www.middleeastpayments.com',
      contactPerson: 'Ahmed Hassan'
    },
    createdAt: '2024-03-05T08:30:00Z',
    updatedAt: '2025-04-10T15:20:00Z'
  },
  {
    id: '4',
    name: 'Latin America Express',
    code: 'LAE',
    description: 'Fast money transfers to Latin America with extensive cash pickup network',
    logo: '/images/partners/lae-logo.png',
    supportedCountries: ['MX', 'BR', 'CO', 'AR', 'PE', 'CL', 'EC', 'GT', 'DO', 'CR'],
    supportedCurrencies: ['USD', 'MXN', 'BRL', 'COP', 'ARS', 'PEN', 'CLP', 'GTQ', 'DOP', 'CRC'],
    supportedMethods: [
      PayoutMethod.CASH_PICKUP,
      PayoutMethod.BANK_TRANSFER,
      PayoutMethod.MOBILE_WALLET
    ],
    apiCredentials: {
      baseUrl: 'https://api.latinamericaexpress.com/v1',
      apiKey: 'mock-api-key',
      apiSecret: 'mock-api-secret'
    },
    isActive: true,
    feeStructure: {
      fixedFee: 2.5,
      percentageFee: 0.7,
      minimumFee: 3,
      maximumFee: 30,
      currency: 'USD'
    },
    contactInfo: {
      email: 'integration@latinamericaexpress.com',
      phone: '+1-305-123-4567',
      website: 'https://www.latinamericaexpress.com',
      contactPerson: 'Carlos Rodriguez'
    },
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2025-03-15T09:45:00Z'
  },
  {
    id: '5',
    name: 'Israel Direct',
    code: 'ISDIR',
    description: 'Specialized in transfers to and from Israel with competitive rates',
    logo: '/images/partners/israeldirect-logo.png',
    supportedCountries: ['IL', 'US', 'CA', 'GB', 'FR', 'DE', 'AU'],
    supportedCurrencies: ['ILS', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    supportedMethods: [
      PayoutMethod.BANK_TRANSFER,
      PayoutMethod.DEBIT_CARD
    ],
    apiCredentials: {
      baseUrl: 'https://api.israeldirect.com/v1',
      apiKey: 'mock-api-key',
      apiSecret: 'mock-api-secret'
    },
    isActive: true,
    feeStructure: {
      fixedFee: 1.5,
      percentageFee: 0.4,
      minimumFee: 2,
      maximumFee: 15,
      currency: 'USD'
    },
    contactInfo: {
      email: 'business@israeldirect.com',
      phone: '+972-3-123-4567',
      website: 'https://www.israeldirect.com',
      contactPerson: 'David Cohen'
    },
    createdAt: '2024-01-25T13:30:00Z',
    updatedAt: '2025-04-02T10:15:00Z'
  }
];
