import { z } from 'zod';
import { VALIDATION_MESSAGES, ID_TYPES, COUNTRIES } from './constants';

export const formSchema = z.object({
  firstName: z.string().min(2, VALIDATION_MESSAGES.required.firstName),
  middleName: z.string().optional(),
  lastName: z.string().min(2, VALIDATION_MESSAGES.required.lastName),
  dob: z.date().min(new Date(VALIDATION_MESSAGES.date.minYear)),
  gender: z.enum(['male', 'female'] as const, {
    errorMap: () => ({ message: VALIDATION_MESSAGES.required.gender })
  }),
  nationality: z.string().min(2, VALIDATION_MESSAGES.required.nationality),
  country: z.enum(['Israel', 'United States', 'United Kingdom', 'Canada', 'Australia'] as const, {
    errorMap: () => ({ message: VALIDATION_MESSAGES.required.country })
  }),
  streetAddress: z.string().min(2, VALIDATION_MESSAGES.required.streetAddress),
  city: z.string().min(2, VALIDATION_MESSAGES.required.city),
  postalCode: z.string().min(5, VALIDATION_MESSAGES.required.postalCode),
  phoneNumber: z.string().min(8, VALIDATION_MESSAGES.required.phoneNumber),
  email: z.string().email(),
  idType: z.union([
    z.object({
      value: z.literal('passport'),
      label: z.literal('Passport')
    }).readonly(),
    z.object({
      value: z.literal('national_id'),
      label: z.literal('National ID')
    }).readonly(),
    z.object({
      value: z.literal('drivers_license'),
      label: z.literal("Driver's License")
    }).readonly(),
    z.object({
      value: z.literal('other'),
      label: z.literal('Other')
    }).readonly()
  ]),
  idNumber: z.string().min(5, VALIDATION_MESSAGES.required.idNumber),
  issueDate: z.date().min(new Date(VALIDATION_MESSAGES.date.minYear)),
  expiryDate: z.date().min(new Date(VALIDATION_MESSAGES.date.minYear)),
  employer: z.string().min(2, VALIDATION_MESSAGES.required.employer),
  occupation: z.string().min(2, VALIDATION_MESSAGES.required.occupation),
  idDocument: z.instanceof(File).optional(),
  proofOfAddress: z.instanceof(File).optional(),
});
