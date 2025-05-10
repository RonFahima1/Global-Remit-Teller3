import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NewClientFormData } from '../types';
import { formSchema } from '../constants';

export function useFormState({ initialData }: { initialData?: NewClientFormData }) {
  const form = useForm<NewClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      personalInfo: {
        firstName: '',
        middleName: '',
        lastName: '',
        dob: new Date(),
        gender: 'male',
        nationality: ''
      },
      address: {
        country: 'Israel',
        streetAddress: '',
        city: '',
        postalCode: ''
      },
      contact: {
        phone: '',
        email: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
      },
      employment: {
        employmentStatus: 'employed',
        employerName: '',
        occupation: '',
        monthlyIncome: 0
      },
      identification: {
        idType: 'passport',
        idNumber: '',
        issueDate: new Date(),
        expiryDate: new Date()
      },
      documentFile: null
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
  }, [form]);

  return {
    form,
    resetForm,
  };
}
