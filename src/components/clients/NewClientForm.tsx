'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NewClientFormProps } from './types';
import { Input } from '@/components/ui/input';
import { FormActions } from './components/FormActions';
import { FormProgress } from './components/FormProgress';
import { PersonalInfoSection } from './components/sections/PersonalInfoSection';
import { AddressSection } from './components/sections/AddressSection';
import { ContactSection } from './components/sections/ContactSection';
import { IdentificationSection } from './components/sections/IdentificationSection';
import { EmploymentSection } from './components/sections/EmploymentSection';
import { DocumentsSection } from './components/sections/DocumentsSection';
import { useFormHandlers } from './hooks/useFormHandlers';
import { useFormProgress } from './hooks/useFormProgress';
import { useFormNavigation } from './hooks/useFormNavigation';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { createPortal } from 'react-dom';
import { useScreenReader } from '@/hooks/use-screen-reader';
import { FormSection, NewClientFormData, IdType, Country, Gender } from './types';
import { formSchema } from './constants';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const newClientSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    dob: z.date().min(new Date('1900-01-01'), 'Date of birth is required'),
    gender: z.enum(['male', 'female'] as const),
    nationality: z.string().min(1, 'Nationality is required'),
  }),
  address: z.object({
    country: z.enum(COUNTRIES),
    streetAddress: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  contact: z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Please enter a valid email address'),
  }),
  identification: z.object({
    idType: z.enum(['passport', 'national_id', 'drivers_license', 'other'] as const),
    idNumber: z.string().min(1, 'ID number is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
  }),
  employment: z.object({
    occupation: z.string().min(1, 'Occupation is required'),
    employer: z.string().min(1, 'Employer is required'),
    income: z.string().min(1, 'Income is required'),
  }),
  documents: z.object({
    idFront: z.string().min(1, 'Front of ID is required'),
    idBack: z.string().min(1, 'Back of ID is required'),
    proofOfAddress: z.string().min(1, 'Proof of address is required'),
  }),
});

interface NewClientFormProps {
  onSubmit: (data: z.infer<typeof newClientSchema>) => void;
  onCancel: () => void;
}

export const NewClientForm: React.FC<NewClientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData = {},
}) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<FormSection>('personal');

  const form = useForm<NewClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      firstName: '',
      middleName: '',
      lastName: '',
      dob: new Date(),
      gender: { value: 'male', label: 'Male' },
      nationality: '',
      country: { value: 'Israel', label: 'Israel' },
      streetAddress: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
      email: '',
      employer: '',
      occupation: '',
      idType: { value: 'passport', label: 'Passport' },
      idNumber: '',
      issueDate: new Date(),
      expiryDate: new Date(),
    },
  });

  const handlers = {
    onSubmitHandler: (data: NewClientFormData) => {
      onSubmit(data);
    },
    handleFileUpload: (file: File, fieldName: string) => {
      // Implement file upload logic
    },
    handleFileRemove: (fieldName: string) => {
      // Implement file removal logic
    },
    sections: ['personal', 'address', 'contact', 'identification', 'employment', 'documents'] as FormSection[],
    currentSection: currentSection,
    setCurrentSection: (section: FormSection) => {
      setCurrentSection(section);
    },
  };

  const portalElement = document.getElementById('form-portal');
  const sections = ['personal', 'address', 'contact', 'identification', 'employment', 'documents'] as FormSection[];
  const formContent = (
    <div className="space-y-6">
      <FormProgress
        currentSection={currentSection}
        sections={sections}
        sectionTitles={{
          personal: 'Personal Information',
          address: 'Address',
          contact: 'Contact Information',
          identification: 'Identification',
          employment: 'Employment',
          documents: 'Documents',
        }}
      />

      <Card>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentSection === 'personal' && (
              <PersonalInfoSection
                form={form}
                GENDERS={GENDERS}
                handleFileUpload={(file: File, fieldName: string) => {
                  // Implement file upload logic
                }}
                handleFileRemove={(fieldName: string) => {
                  // Implement file removal logic
                }}
              />
            )}
            {currentSection === 'address' && (
              <AddressSection
                form={form}
                COUNTRIES={COUNTRIES}
              />
            )}
            {currentSection === 'contact' && <ContactSection form={form} />}
            {currentSection === 'identification' && (
              <IdentificationSection
                form={form}
                ID_TYPES={ID_TYPES}
                handleFileUpload={(file: File, fieldName: string) => {
                  // Implement file upload logic
                }}
                handleFileRemove={(fieldName: string) => {
                  // Implement file removal logic
                }}
              />
            )}
            {currentSection === 'employment' && <EmploymentSection form={form} />}
            {currentSection === 'documents' && <DocumentsSection form={form} />}

            <FormActions
              currentSection={currentSection}
              handlePrevious={() => {
                const currentIndex = sections.indexOf(currentSection);
                if (currentIndex > 0) {
                  setCurrentSection(sections[currentIndex - 1]);
                }
              }}
              handleNext={() => {
                const currentIndex = sections.indexOf(currentSection);
                if (currentIndex < sections.length - 1) {
                  setCurrentSection(sections[currentIndex + 1]);
                }
              }}
              handleSubmit={form.handleSubmit(onSubmit)}
              onCancel={onCancel}
              isSubmitting={form.formState.isSubmitting}
              formError={formError}
              formSuccess={formSuccess}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};