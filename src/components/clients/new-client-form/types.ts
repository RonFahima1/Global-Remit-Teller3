import { z } from 'zod';

// Form data types
export type NewClientFormData = {
  personalInfo: PersonalInfo;
  address: AddressInfo;
  contact: ContactInfo;
  employment: EmploymentInfo;
  identification: IdentificationInfo;
  documentFile: File | null;
};

export type PersonalInfo = {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: Date;
  gender: 'male' | 'female';
  nationality: string;
};

export type AddressInfo = {
  country: string;
  streetAddress: string;
  city: string;
  postalCode: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};

export type EmploymentInfo = {
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
  employerName: string;
  occupation: string;
  monthlyIncome: number;
};

export type IdentificationInfo = {
  idType: 'passport' | 'national_id' | 'drivers_license' | 'other';
  idNumber: string;
  issueDate: Date;
  expiryDate: Date;
};

// Form section types
export type SectionName = 'personalInfo' | 'address' | 'contact' | 'employment' | 'identification' | 'documents';

export type FormSection = SectionName;

// Form state types
export type FormState = {
  currentSection: FormSection;
  isSubmitting: boolean;
  formError: string | null;
  formSuccess: string | null;
  formData: NewClientFormData;
};

export type IdType = {
  value: 'passport' | 'national_id' | 'drivers_license' | 'other';
  label: string;
};

export type Country = {
  value: 'Israel' | 'United States' | 'United Kingdom' | 'Canada' | 'Australia';
  label: string;
};

export type Gender = {
  value: 'male' | 'female';
  label: string;
};

// Form props
export interface NewClientFormProps {
  onSubmit: (data: NewClientFormData, metadata: { documentFile: File | null }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<NewClientFormData>;
}

// Form field render props
export interface FormFieldRenderProps {
  field: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    value: string | number | readonly string[];
    name: string;
    ref: React.RefObject<HTMLInputElement>;
  };
}

// Address section props
export interface AddressSectionProps {
  control: z.ZodType<any, any, any>;
  formState: {
    errors: Record<string, string>;
  };
}

// Select component props
export interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}
