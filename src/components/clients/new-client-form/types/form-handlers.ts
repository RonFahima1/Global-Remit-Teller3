import { SubmitHandler } from 'react-hook-form';
import { NewClientFormData } from './form-data';
import { DocumentFile } from './file-types';
import { FormError } from './form-state';

export type FormSubmitHandler = SubmitHandler<NewClientFormData>;

export type FormValidationHandler = (data: NewClientFormData) => Promise<FormError[]>;

export type FormValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};
