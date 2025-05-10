import { UseFormReturn } from 'react-hook-form';
import { NewClientFormData } from '../../types/form-data';
import { FileError } from '@/components/ui/file-upload.types';

export type FormSubmitResult = {
  success: boolean;
  data?: NewClientFormData;
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
};

export type FormSubmitHandler = (
  data: NewClientFormData
) => Promise<FormSubmitResult>;

export type FormError = {
  type: string | 'file';
  message: string;
  fileErrors?: Record<string, FileError>;
};

export type FormErrors = {
  [key: string]: FormError;
};

export type FormValidationResult = {
  isValid: boolean;
  errors: FormErrors;
};

export type FormValidationHandler = (data: NewClientFormData) => FormValidationResult;

export type FormState = {
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isFailed: boolean;
  errorMessage?: string;
  successMessage?: string;
};

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

export type FormActionsProps = {
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

export type SectionProps = {
  form: UseFormReturn<NewClientFormData>;
};

export type FormSectionProps = {
  data: NewClientFormData;
  onChange: (data: Partial<NewClientFormData>) => void;
  errors: FormErrors;
  touched: Record<string, boolean>;
};

export type ContactSectionProps = FormSectionProps;
export type AddressSectionProps = FormSectionProps;
export type PersonalInfoSectionProps = FormSectionProps;
export type IdentificationSectionProps = FormSectionProps;
export type EmploymentSectionProps = FormSectionProps;
export type DocumentsSectionProps = FormSectionProps;
