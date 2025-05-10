'use client';

import { useToast } from '@/components/ui/use-toast';
import { useScreenReader } from '@/hooks/use-screen-reader';
import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { NewClientFormData } from '../types';
import { VALIDATION_MESSAGES } from '../constants/validation';

interface UseFormHandlersProps {
  form: UseFormReturn<NewClientFormData>;
  onSubmit: (data: NewClientFormData, metadata: { documentFile: File | null }) => Promise<void>;
  onCancel: () => void;
  resetForm: () => void;
}

export function useFormHandlers({
  form,
  onSubmit,
  onCancel,
  resetForm
}: UseFormHandlersProps) {
  const { toast } = useToast();
  const { announce } = useScreenReader();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      setFormSuccess(null);
      
      // Validate all form fields
      const isValid = await form.trigger();
      if (!isValid) {
        const errors = form.formState.errors;
        const firstError = Object.values(errors)[0];
        const errorMessage = firstError?.message?.toString() || 'Form validation failed';
        
        toast({
          title: 'Validation Error',
          description: errorMessage,
          variant: 'destructive'
        });
        
        announce(`Form error: ${errorMessage}`);
        throw new Error(errorMessage);
      }
      
      const data = form.getValues();
      const documentFile = data.documentFile;
      
      await onSubmit(data, { documentFile });
      
      setFormSuccess('Client registration successful!');
      toast({
        title: 'Success',
        description: 'Client registration successful!',
        variant: 'default'
      });
      
      resetForm();
      announce('Form submitted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setFormError(errorMessage);
      announce(`Form submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, onSubmit, resetForm, toast, announce]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // File validation is handled in the form hook
      form.setValue(fieldName as any, file);
      form.trigger(fieldName as any);
      
      announce(`File selected: ${file.name}`);
    } catch (error) {
      toast({
        title: 'File Error',
        description: error instanceof Error ? error.message : 'Failed to process file',
        variant: 'destructive',
      });
    }
  }, [form, toast, announce]);

  const handleReset = useCallback(() => {
    resetForm();
    setFormError(null);
    setFormSuccess(null);
    announce('Form reset successfully');
    
    toast({
      title: 'Form Reset',
      description: 'The form has been reset',
      variant: 'default'
    });
  }, [resetForm, announce, toast]);
  
  const handleCancel = useCallback(() => {
    onCancel();
    announce('Form cancelled');
  }, [onCancel, announce]);

  return {
    isSubmitting,
    formError,
    formSuccess,
    handleSubmit,
    handleFileChange,
    handleReset,
    handleCancel
  };
}
