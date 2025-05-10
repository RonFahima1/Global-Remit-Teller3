import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { useState, useCallback } from 'react';
import type { NewClientFormProps } from '../types';
import type { FormState, FormSection } from '../types';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, VALIDATION_MESSAGES } from '../constants/validation';
import type { NewClientFormData } from '../types';
import { formSchema } from '../constants';

const defaultFormValues: NewClientFormData = {
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
    email: '',
    phone: '',
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
};

const sectionConfig = {
  sections: ['personalInfo', 'address', 'contact', 'employment', 'identification', 'documents'] as readonly FormSection[],
  sectionTitles: {
    personalInfo: 'Personal Information',
    address: 'Address',
    contact: 'Contact',
    employment: 'Employment',
    identification: 'Identification',
    documents: 'Documents'
  } as Record<FormSection, string>
} as const;

export const useNewClientForm = () => {
  const [currentSection, setCurrentSection] = useState<FormSection>(sectionConfig.sections[0]);
  const [formState, setFormState] = useState<FormState>({
    currentSection: sectionConfig.sections[0],
    isSubmitting: false,
    formError: null,
    formSuccess: null,
    formData: defaultFormValues
  });

  const form = useForm<NewClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues
  });

  const handleFileUpload = useCallback(async (field: keyof NewClientFormData, file: File) => {
    try {
      // TODO: Implement file upload logic
      form.setValue(field as keyof NewClientFormData, file);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, [form]);

  const handleFileRemove = useCallback((field: keyof NewClientFormData) => {
    form.setValue(field as keyof NewClientFormData, null);
  }, [form]);

  const handlePrevious = useCallback(() => {
    const currentIndex = sectionConfig.sections.indexOf(currentSection);
    if (currentIndex > 0) {
      const prevSection = sectionConfig.sections[currentIndex - 1];
      setCurrentSection(prevSection);
      setFormState(prev => ({
        ...prev,
        currentSection: prevSection
      }));
    }
  }, [currentSection]);

  const handleNext = useCallback(() => {
    const currentIndex = sectionConfig.sections.indexOf(currentSection);
    if (currentIndex < sectionConfig.sections.length - 1) {
      const nextSection = sectionConfig.sections[currentIndex + 1];
      setCurrentSection(nextSection);
      setFormState(prev => ({
        ...prev,
        currentSection: nextSection
      }));
    }
  }, [currentSection]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      formError: null,
      formSuccess: null
    }));

    try {
      await form.handleSubmit(async (data) => {
        // Here you would typically make an API call
        // For now, we'll just simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          formSuccess: 'Client created successfully'
        }));
      })();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        formError: errorMessage
      }));
    }
  }, [form]);

  const resetForm = useCallback(() => {
    form.reset(defaultFormValues);
    setCurrentSection(sectionConfig.sections[0]);
    setFormState({
      currentSection: sectionConfig.sections[0],
      isSubmitting: false,
      formError: null,
      formSuccess: null,
      formData: defaultFormValues
    });
  }, [form]);

  return {
    form,
    formState,
    setFormState,
    currentSection,
    handlePrevious,
    handleNext,
    handleSubmit,
    handleFileUpload,
    handleFileRemove,
    resetForm,
  } as const;
  };

  return {
    form,
    state,
    setState,
    resetForm,
    handleFileUpload,
    handleFileRemove,
    handleFormSubmit
  };
}
