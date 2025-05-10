'use client';

import { useToast } from '@/components/ui/use-toast';
import { useScreenReader } from '@/hooks/use-screen-reader';
import { FormStateReturn } from 'react-hook-form';
import { NewClientFormData } from '../types';

export function useFormHandlers({
  formState,
  onSubmit,
  onCancel,
  resetForm,
  handleFileUpload,
  handleFileRemove,
  formSchema,
}: {
  formState: FormStateReturn<NewClientFormData>;
  onSubmit: (data: NewClientFormData) => Promise<void>;
  onCancel: () => void;
  resetForm: () => void;
  handleFileUpload: (file: File, fieldName: string) => Promise<void>;
  handleFileRemove: (fieldName: string) => void;
  formSchema: any;
}) {
  const { toast } = useToast();
  const { announce } = useScreenReader();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const onSubmitHandler = async (data: NewClientFormData) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      setFormSuccess(null);
      
      const validationErrors = formSchema.safeParse(data).error;
      if (validationErrors) {
        throw new Error('Form validation failed');
      }

      await onSubmit(data);
      setFormSuccess('Client registration successful!');
      resetForm();
      announce('Form submitted successfully');
    } catch (error) {
      setFormError('Failed to submit form. Please check your input and try again.');
      announce('Form submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await handleFileUpload(file, fieldName);
      announce(`File uploaded successfully: ${file.name}`);
    } catch (error) {
      toast({
        title: 'File Upload Error',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    resetForm();
    setFormError(null);
    setFormSuccess(null);
    announce('Form reset successfully');
  };

  return {
    isSubmitting,
    formError,
    formSuccess,
    onSubmitHandler,
    handleFileChange,
    handleReset,
  };
}
