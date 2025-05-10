import { z } from 'zod';

export type NewClientFormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  nationality: string;
  idType: string;
  idNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  occupation: string;
  employer: string;
  documents: File[];
};

export interface NewClientFormProps {
  onSubmit: (data: NewClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: NewClientFormData;
}

export type FormSection = 'personal' | 'address' | 'contact' | 'identification' | 'employment' | 'documents';

export interface FormNavigationProps {
  currentSection: FormSection;
  sections: FormSection[];
  sectionTitles: Record<FormSection, string>;
  handleNext: () => void;
  handlePrevious: () => void;
  isFormValid: boolean;
  isSubmitting: boolean;
}

export interface FormState {
  isSubmitting: boolean;
  formError?: string;
  formSuccess?: string;
  currentSection: FormSection;
}
