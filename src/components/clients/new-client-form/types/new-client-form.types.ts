import { ID_TYPES, COUNTRIES, GENDERS, MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, VALIDATION_MESSAGES } from '../constants';
import { useForm, UseFormReturn, SubmitHandler as FormSubmitHandler } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { z, ZodObject, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ID Types
export interface IDType {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
}

// Form State
export interface FormState {
  loading: boolean;
  error?: string;
  success?: string;
}

// Form Data Types
export interface NewClientFormData {
  // Personal Information
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: Date;
  gender: 'male' | 'female';
  nationality: string;

  // Address Information
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;

  // Contact Information
  email: string;
  phone: string;

  // Identification Information
  idType: IDType;
  idNumber: string;
  idExpiryDate: Date;
  idDocument?: File;
  proofOfAddress?: File;

  // Employment Information
  occupation?: string;
  employer?: string;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed';
  monthlyIncome?: number;
  idDocument?: File;
  proofOfAddress?: File;
  documentFile?: File;
}

// Form Props
export interface NewClientFormProps {
  onSubmit: FormSubmitHandler;
  onCancel: () => void;
  isLoading?: boolean;
}

export type FormSubmitHandler = SubmitHandler<NewClientFormData>;
export type FormError = {
  field: keyof NewClientFormData;
  message: string;
};

export type FormValidationHandler = (data: NewClientFormData) => Promise<FormError[]>;

// File Types
export type FileField = 'idDocument' | 'proofOfAddress';

// Form Return Types
export interface UseNewClientFormReturn extends ReturnType<typeof useForm<NewClientFormData>> {
  state: FormState;
  setState: Dispatch<SetStateAction<FormState>>;
  handleFileUpload: (field: FileField, file: File) => Promise<void>;
  handleFileRemove: (field: FileField) => void;
  handleCancel: () => void;
  handleSubmit: FormSubmitHandler;
  resetForm: () => void;
}

export type FormValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

// Form Field State
export type FormFieldState = {
  value: string | number | Date | undefined;
  error?: string;
  touched: boolean;
  isValid: boolean;
  isDirty: boolean;
  isLoading: boolean;
  isRequired: boolean;
  characterCount?: number;
  maxCharacterCount?: number;
  isFocused: boolean;
  hasError: boolean;
  hasSuccess: boolean;
  helpText?: string;
  placeholder?: string;
  tooltip?: string;
};

// Form Field Props
export interface FormFieldProps {
  form: any;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  error?: string;
}

// Form Actions
export interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const formValidationSchema = z.object({
  personalInfo: z.object({
    firstName: z.string()
      .min(2, VALIDATION_MESSAGES.required.firstName)
      .max(VALIDATION_MESSAGES.max.firstName, `First name must be less than ${VALIDATION_MESSAGES.max.firstName} characters`),
    middleName: z.string().optional(),
    lastName: z.string()
      .min(2, VALIDATION_MESSAGES.required.lastName)
      .max(VALIDATION_MESSAGES.max.lastName, `Last name must be less than ${VALIDATION_MESSAGES.max.lastName} characters`),
    dob: z.date()
      .min(new Date(VALIDATION_MESSAGES.date.minYear), VALIDATION_MESSAGES.date.dob)
      .max(new Date(), 'Date of birth cannot be in the future'),
    gender: z.enum(['male', 'female'] as const, {
      errorMap: () => ({ message: VALIDATION_MESSAGES.required.gender })
    }),
    nationality: z.string()
      .min(2, VALIDATION_MESSAGES.required.nationality)
      .max(VALIDATION_MESSAGES.max.nationality, `Nationality must be less than ${VALIDATION_MESSAGES.max.nationality} characters`)
  }),
  address: z.object({
    country: z.enum(COUNTRIES, {
      errorMap: () => ({ message: VALIDATION_MESSAGES.required.country })
    }),
    streetAddress: z.string()
      .min(5, VALIDATION_MESSAGES.required.streetAddress)
      .max(VALIDATION_MESSAGES.max.streetAddress, `Street address must be less than ${VALIDATION_MESSAGES.max.streetAddress} characters`),
    city: z.string()
      .min(2, VALIDATION_MESSAGES.required.city)
      .max(VALIDATION_MESSAGES.max.city, `City must be less than ${VALIDATION_MESSAGES.max.city} characters`),
    postalCode: z.string()
      .min(5, VALIDATION_MESSAGES.required.postalCode)
      .max(VALIDATION_MESSAGES.max.postalCode, `Postal code must be less than ${VALIDATION_MESSAGES.max.postalCode} characters`)
      .regex(/^[0-9]{5,10}$/, VALIDATION_MESSAGES.format.postalCode)
  }),
  contact: z.object({
    phoneNumber: z.string()
      .min(VALIDATION_MESSAGES.min.phoneNumber, VALIDATION_MESSAGES.required.phoneNumber)
      .max(VALIDATION_MESSAGES.max.phoneNumber, `Phone number must be less than ${VALIDATION_MESSAGES.max.phoneNumber} characters`)
      .regex(VALIDATION_MESSAGES.pattern.phoneNumber, VALIDATION_MESSAGES.format.phoneNumber),
    email: z.string()
      .email('Invalid email address')
      .max(VALIDATION_MESSAGES.max.email, `Email must be less than ${VALIDATION_MESSAGES.max.email} characters`)
  }),
  identification: z.object({
    idType: z.enum(['passport', 'national_id', 'drivers_license', 'other'] as const, {
      errorMap: () => ({ message: VALIDATION_MESSAGES.required.idType })
    }),
    idNumber: z.string()
      .min(VALIDATION_MESSAGES.min.idNumber, VALIDATION_MESSAGES.required.idNumber)
      .max(VALIDATION_MESSAGES.max.idNumber, `ID number must be less than ${VALIDATION_MESSAGES.max.idNumber} characters`),
    issueDate: z.date()
      .min(new Date(VALIDATION_MESSAGES.date.minYear), VALIDATION_MESSAGES.date.issueDate)
      .max(new Date(), 'Issue date cannot be in the future'),
    expiryDate: z.date()
      .min(new Date(VALIDATION_MESSAGES.date.minYear), VALIDATION_MESSAGES.date.expiryDate)
  }).refine((data) => {
    return !data.issueDate || !data.expiryDate || data.expiryDate > data.issueDate;
  }, {
    message: VALIDATION_MESSAGES.date.expiryDate,
    path: ['expiryDate']
  }),
  employment: z.object({
    employer: z.string()
      .min(2, VALIDATION_MESSAGES.required.employer)
      .max(VALIDATION_MESSAGES.max.employer, `Employer name must be less than ${VALIDATION_MESSAGES.max.employer} characters`),
    occupation: z.string()
      .min(2, VALIDATION_MESSAGES.required.occupation)
      .max(VALIDATION_MESSAGES.max.occupation, `Occupation must be less than ${VALIDATION_MESSAGES.max.occupation} characters`)
  }),
  documents: z.object({
    idDocument: z.any().optional().refine(
      (value) => !value || (value && value.size <= MAX_FILE_SIZE),
      VALIDATION_MESSAGES.file.size
    ).refine(
      (value) => !value || (value && ACCEPTED_IMAGE_TYPES.includes(value.type)),
      VALIDATION_MESSAGES.file.type
    ),
    proofOfAddress: z.any().optional().refine(
      (value) => !value || (value && value.size <= MAX_FILE_SIZE),
      VALIDATION_MESSAGES.file.size
    ).refine(
      (value) => !value || (value && ACCEPTED_IMAGE_TYPES.includes(value.type)),
      VALIDATION_MESSAGES.file.type
    )
  })
});
