import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Import toast from our custom utility
import { toast } from '@/lib/toast';
import { useState, useCallback, useEffect } from 'react';
import type { NewClientFormProps } from '../types';
import type { FormState, FormSection } from '../types';
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES, VALIDATION_MESSAGES } from '../constants/validation';
import type { NewClientFormData } from '../types';
import { formSchema } from '../schema';
import { useFormNavigation } from './useFormNavigation';

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
    idExpiryDate: new Date(),
    documentFile: null
  },
  documents: {
    proofOfAddress: null,
    financialDocuments: null,
    additionalDocuments: null
  }
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

export const useNewClientForm = ({ onSubmit, onCancel, isLoading = false, initialData }: NewClientFormProps) => {
  // No need to destructure toast as we're importing it directly
  const [state, setState] = useState<FormState>({
    currentSection: sectionConfig.sections[0],
    isSubmitting: isLoading,
    formError: null,
    formSuccess: null,
    formData: initialData ? { ...defaultFormValues, ...initialData } : defaultFormValues
  });

  const form = useForm<NewClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? { ...defaultFormValues, ...initialData } : defaultFormValues,
    mode: 'onChange'
  });

  // File handling - updated to handle nested fields
  const handleFileUpload = useCallback(async (fieldPath: string, file: File) => {
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(VALIDATION_MESSAGES.fileSize);
        return;
      }
      
      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(VALIDATION_MESSAGES.fileType);
        return;
      }
      
      // Set the value using the path string (e.g., 'identification.documentFile')
      form.setValue(fieldPath, file, { shouldValidate: true });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return Promise.reject(error);
    }
  }, [form]);

  const handleFileRemove = useCallback((fieldPath: string) => {
    form.setValue(fieldPath, null, { shouldValidate: true });
    toast.info('File removed');
  }, [form]);

  // Navigation logic using the custom hook
  const { handlePrevious, handleNext, goToSection } = useFormNavigation({
    sections: sectionConfig.sections as FormSection[],
    currentSection: state.currentSection,
    updateCurrentSection: (section: FormSection) => setState((prev: FormState) => ({ ...prev, currentSection: section }))
  });

  // Form submission handling
  const handleFormSubmit = useCallback(async () => {
    setState((prev: FormState) => ({
      ...prev,
      isSubmitting: true,
      formError: null,
      formSuccess: null
    }));

    try {
      // Validate the entire form
      const isValid = await form.trigger();
      
      if (!isValid) {
        setState((prev: FormState) => ({
          ...prev,
          isSubmitting: false,
          formError: 'Please fix the errors in the form before submitting'
        }));
        
        toast.error('Please fix the errors in the form before submitting');
        return;
      }
      
      const formData = form.getValues();
      
      // Collect all document files for submission
      const files = {
        identificationDocument: formData.identification.documentFile,
        proofOfAddress: formData.documents.proofOfAddress,
        financialDocuments: formData.documents.financialDocuments,
        additionalDocuments: formData.documents.additionalDocuments
      };
      
      await onSubmit(formData, files);
      
      setState((prev: FormState) => ({
        ...prev,
        isSubmitting: false,
        formSuccess: 'Client created successfully'
      }));
      
      toast.success('Client created successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setState((prev: FormState) => ({
        ...prev,
        isSubmitting: false,
        formError: errorMessage
      }));
      
      toast.error(errorMessage);
    }
  }, [form, onSubmit]);

  const resetForm = useCallback(() => {
    form.reset(defaultFormValues);
    setState({
      currentSection: sectionConfig.sections[0],
      isSubmitting: false,
      formError: null,
      formSuccess: null,
      formData: defaultFormValues
    });
  }, [form]);

  // Watch for form changes to update formData in state
  useEffect(() => {
    const subscription = form.watch((value: any) => {
      setState((prev: FormState) => ({
        ...prev,
        formData: value as NewClientFormData
      }));
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return {
    form,
    state,
    setState,
    resetForm,
    handleFileUpload,
    handleFileRemove,
    handleFormSubmit,
    handleNext,
    handlePrevious,
    goToSection,
    sectionConfig
  };
}
}
