// Form constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf'
];

// Form options
import { z } from 'zod';

export const ID_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID' },
  { value: 'drivers_license', label: 'Driver\'s License' },
  { value: 'other', label: 'Other' }
] as const;

export const COUNTRIES = [
  { value: 'Israel', label: 'Israel' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' }
] as const;

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
] as const;

export const EMPLOYMENT_STATUSES = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' }
] as const;

// Form validation schema
import { NewClientFormData } from './types';

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.date().min(new Date('1900-01-01'), 'Date of birth is required'),
  gender: z.enum(['male', 'female'] as const),
  nationality: z.string().min(1, 'Nationality is required'),
});

export const addressSchema = z.object({
  country: z.enum(['Israel', 'United States', 'United Kingdom', 'Canada', 'Australia'] as const),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(1, 'Emergency contact phone is required'),
});

export const employmentSchema = z.object({
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'student', 'retired'] as const),
  employerName: z.string().min(1, 'Employer name is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  monthlyIncome: z.number().min(0, 'Monthly income must be non-negative'),
});

export const identificationSchema = z.object({
  idType: z.enum(['passport', 'national_id', 'drivers_license', 'other'] as const),
  idNumber: z.string().min(1, 'ID number is required'),
  issueDate: z.date().min(new Date('1900-01-01'), 'Invalid issue date'),
  expiryDate: z.date().min(new Date('1900-01-01'), 'Invalid expiry date'),
});

export const formSchema = z.object({
  personalInfo: personalInfoSchema,
  address: addressSchema,
  contact: contactSchema,
  employment: employmentSchema,
  identification: identificationSchema,
  documentFile: z.instanceof(File).optional()
}) as z.ZodType<NewClientFormData>;
// Form validation messages
export const VALIDATION_MESSAGES = {
  file: {
    size: `File must be under 5MB`,
    type: `File must be one of these types: .jpg, .jpeg, .png, .webp, .pdf`,
  },
  required: {
    firstName: "First name is required",
    middleName: "Middle name is required",
    lastName: "Last name is required",
    dob: "Date of birth is required",
    gender: "Gender is required",
    nationality: "Nationality is required",
    country: "Country is required",
    streetAddress: "Street address is required",
    city: "City is required",
    postalCode: "Postal code is required",
    phoneNumber: "Phone number is required",
    email: "Email address is required",
    employer: "Employer name is required",
    occupation: "Occupation is required",
    idType: "ID type is required",
    idNumber: "ID number is required",
    issueDate: "Issue date is required",
    expiryDate: "Expiry date is required",
  },
  format: {
    phoneNumber: "Phone number must only contain numbers and valid characters",
    postalCode: "Postal code must be between 5 and 10 characters",
    idNumber: "ID number must be between 5 and 50 characters",
  },
  date: {
    dob: "Date of birth must be after 1900 and before today",
    issueDate: "Issue date must be after 1900 and before today",
    expiryDate: "Expiry date must be after issue date and before today",
    minYear: 1900,
  },
  min: {
    lastName: 2,
    phoneNumber: 8,
    idNumber: 5,
  },
  max: {
    firstName: 50,
    lastName: 50,
    nationality: 50,
    streetAddress: 100,
    city: 50,
    postalCode: 10,
    phoneNumber: 20,
    email: 100,
    employer: 50,
    occupation: 50,
    idNumber: 50,
  },
  pattern: {
    phoneNumber: /^[0-9\s+()-]*$/,
  },
};
