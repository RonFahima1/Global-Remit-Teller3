'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface UseFormHandlersProps {
  formState: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  resetForm: () => void;
  handleFileUpload: (file: File) => void;
  handleFileRemove: (id: string) => void;
  formSchema: z.ZodSchema;
}

export function useFormHandlers({
  formState,
  onSubmit,
  onCancel,
  resetForm,
  handleFileUpload,
  handleFileRemove,
  formSchema,
}: UseFormHandlersProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [formSuccess, setFormSuccess] = useState<string | undefined>(undefined);

  const onSubmitHandler = async (data: any) => {
    try {
      setIsSubmitting(true);
      setFormError(undefined);
      setFormSuccess(undefined);

      await onSubmit(data);
      
      setFormSuccess('Form submitted successfully');
      toast({
        title: 'Success',
        description: 'Form submitted successfully',
      });
    } catch (error: any) {
      setFormError(error.message || 'An error occurred while submitting the form');
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while submitting the form',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    resetForm();
    setFormError(undefined);
    setFormSuccess(undefined);
  };

  return {
    isSubmitting,
    formError,
    formSuccess,
    onSubmitHandler,
    handleReset,
  };
}
