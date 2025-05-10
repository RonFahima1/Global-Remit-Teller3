import { UseFormReturn } from 'react-hook-form';
import { NewClientFormData } from './form-data';

export interface SectionProps {
  form: UseFormReturn<NewClientFormData>;
  countries: { value: string; label: string }[];
  genders: { value: string; label: string }[];
  idTypes: { value: string; label: string }[];
}

export interface SectionComponentProps extends SectionProps {
  // Add any additional props that might be needed by specific sections
}
