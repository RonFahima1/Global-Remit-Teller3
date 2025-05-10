'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '../schema';

interface UseNewClientFormProps {
  initialData?: any;
}

export function useNewClientForm({ initialData }: UseNewClientFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      gender: '',
      nationality: '',
      idType: '',
      idNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      email: '',
      occupation: '',
      employer: '',
      documents: [],
    },
  });

  const state = {
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
  };

  const handleFileUpload = (file: File) => {
    const files = form.getValues('documents') || [];
    form.setValue('documents', [...files, file]);
  };

  const handleFileRemove = (index: number) => {
    const files = form.getValues('documents') || [];
    const updatedFiles = files.filter((_, i) => i !== index);
    form.setValue('documents', updatedFiles);
  };

  const handleFormSubmit = async (data: any) => {
    // Handle form submission here
    console.log('Form submitted:', data);
  };

  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    state,
    handleFileUpload,
    handleFileRemove,
    handleFormSubmit,
    resetForm,
  };
}
