import { z } from 'zod';
import { VALIDATION_MESSAGES, PATTERNS, MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from './constants/validation';
import { ID_TYPES } from './constants/identification';
import { COUNTRIES } from './constants/countries';

// Define nested schemas for each section
const personalInfoSchema = z.object({
  firstName: z.string()
    .min(2, VALIDATION_MESSAGES.minLength(2))
    .max(50, VALIDATION_MESSAGES.maxLength(50))
    .regex(PATTERNS.letters, VALIDATION_MESSAGES.pattern),
  middleName: z.string()
    .max(50, VALIDATION_MESSAGES.maxLength(50))
    .regex(PATTERNS.letters, VALIDATION_MESSAGES.pattern)
    .optional(),
  lastName: z.string()
    .min(2, VALIDATION_MESSAGES.minLength(2))
    .max(50, VALIDATION_MESSAGES.maxLength(50))
    .regex(PATTERNS.letters, VALIDATION_MESSAGES.pattern),
  dob: z.date()
    .refine(date => {
      const today = new Date();
      const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      return date <= minAge;
    }, VALIDATION_MESSAGES.minAge(18)),
  gender: z.enum(['male', 'female'] as const),
  nationality: z.string().min(2, VALIDATION_MESSAGES.minLength(2))
});

const addressSchema = z.object({
  country: z.string().min(2, VALIDATION_MESSAGES.required),
  streetAddress: z.string()
    .min(5, VALIDATION_MESSAGES.minLength(5))
    .max(100, VALIDATION_MESSAGES.maxLength(100)),
  city: z.string()
    .min(2, VALIDATION_MESSAGES.minLength(2))
    .max(50, VALIDATION_MESSAGES.maxLength(50))
    .regex(PATTERNS.letters, VALIDATION_MESSAGES.pattern),
  postalCode: z.string()
    .regex(PATTERNS.postalCode, VALIDATION_MESSAGES.postalCode)
});

const contactSchema = z.object({
  email: z.string()
    .email(VALIDATION_MESSAGES.email)
    .min(5, VALIDATION_MESSAGES.minLength(5))
    .max(100, VALIDATION_MESSAGES.maxLength(100)),
  phone: z.string()
    .regex(PATTERNS.phone, VALIDATION_MESSAGES.phone),
  emergencyContactName: z.string()
    .min(2, VALIDATION_MESSAGES.minLength(2))
    .max(100, VALIDATION_MESSAGES.maxLength(100))
    .regex(PATTERNS.letters, VALIDATION_MESSAGES.pattern),
  emergencyContactPhone: z.string()
    .regex(PATTERNS.phone, VALIDATION_MESSAGES.phone)
});

const employmentSchema = z.object({
  employmentStatus: z.enum([
    'employed', 'self-employed', 'unemployed', 'student', 'retired'
  ] as const),
  employerName: z.string()
    .min(2, VALIDATION_MESSAGES.minLength(2))
    .max(100, VALIDATION_MESSAGES.maxLength(100))
    .optional()
    .refine(
      (val) => {
        // If employed, employer name is required
        return true; // This will be refined at runtime based on employment status
      },
      { message: VALIDATION_MESSAGES.required }
    ),
  occupation: z.string()
    .min(2, VALIDATION_MESSAGES.minLength(2))
    .max(100, VALIDATION_MESSAGES.maxLength(100))
    .optional()
    .refine(
      (val) => {
        // If employed or self-employed, occupation is required
        return true; // This will be refined at runtime based on employment status
      },
      { message: VALIDATION_MESSAGES.required }
    ),
  monthlyIncome: z.number()
    .min(0, VALIDATION_MESSAGES.income)
    .optional()
    .refine(
      (val) => {
        // If employed or self-employed, income is required
        return true; // This will be refined at runtime based on employment status
      },
      { message: VALIDATION_MESSAGES.required }
    )
});

// File validation schema
const fileSchema = z.union([
  z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, VALIDATION_MESSAGES.fileSize)
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file.type),
      VALIDATION_MESSAGES.fileType
    ),
  z.string(), // For when file is represented as a URL string
])
.nullable()
.optional();

const identificationSchema = z.object({
  idType: z.enum(['passport', 'national_id', 'driver_license', 'residence_permit', 'other'] as const),
  idNumber: z.string()
    .min(5, VALIDATION_MESSAGES.minLength(5))
    .max(20, VALIDATION_MESSAGES.maxLength(20)),
  idExpiryDate: z.date()
    .refine(date => date > new Date(), VALIDATION_MESSAGES.futureDate),
  documentFile: fileSchema
});



// Documents schema
const documentsSchema = z.object({
  proofOfAddress: fileSchema,
  financialDocuments: fileSchema,
  additionalDocuments: fileSchema
});

// Main form schema
export const formSchema = z.object({
  personalInfo: personalInfoSchema,
  address: addressSchema,
  contact: contactSchema,
  employment: employmentSchema,
  identification: identificationSchema,
  documents: documentsSchema
});

// Type for the form data
export type NewClientFormData = z.infer<typeof formSchema>;

// Validation for specific sections
export const validateSection = (section: string, data: any) => {
  switch(section) {
    case 'personalInfo':
      return personalInfoSchema.safeParse(data);
    case 'address':
      return addressSchema.safeParse(data);
    case 'contact':
      return contactSchema.safeParse(data);
    case 'employment':
      return employmentSchema.safeParse(data);
    case 'identification':
      return identificationSchema.safeParse(data);
    case 'documents':
      return documentsSchema.safeParse(data);
    default:
      return { success: false, error: new Error('Invalid section') };
  }
};
