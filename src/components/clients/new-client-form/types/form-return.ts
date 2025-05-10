import { UseFormReturn } from 'react-hook-form';
import { NewClientFormData } from './form-data';
import { FormState } from './form-state';
import { FileField } from './file-types';
import { Dispatch, SetStateAction } from 'react';

export interface UseNewClientFormReturn {
  form: UseFormReturn<NewClientFormData>;
  state: FormState;
  setState: Dispatch<SetStateAction<FormState>>;
  handleFileUpload: (field: FileField, file: File) => Promise<void>;
  handleFileRemove: (field: FileField) => void;
  handleFormSubmit: (onSuccess: () => void, onError: (error: string) => void) => Promise<void>;
  resetForm: () => void;
}
