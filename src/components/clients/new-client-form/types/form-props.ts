import { FormSubmitHandler } from './form-handlers';

export interface NewClientFormProps {
  onSubmit: FormSubmitHandler;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<NewClientFormData>;
}
