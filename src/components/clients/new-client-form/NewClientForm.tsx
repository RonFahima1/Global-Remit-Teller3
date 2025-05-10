'use client';

import { Card } from '@/components/ui/card';
import { useNewClientForm } from './hooks/useNewClientForm';
import { FormActions } from './components/FormActions';
import { FormProgress } from './components/FormProgress';
import { PersonalInfoSection } from './components/sections/PersonalInfoSection';
import { AddressSection } from './components/sections/AddressSection';
import { ContactSection } from './components/sections/ContactSection';
import { IdentificationSection } from './components/sections/IdentificationSection';
import { EmploymentSection } from './components/sections/EmploymentSection';
import { DocumentsSection } from './components/sections/DocumentsSection';
import { COUNTRIES, GENDERS, ID_TYPES } from './constants';
import type { NewClientFormProps } from './types';
import type { SectionProps } from './types/section-props';

export function NewClientForm({ onSubmit, onCancel }: NewClientFormProps) {
  const { 
    form, 
    state, 
    setState, 
    handleFileUpload, 
    handleFileRemove, 
    handleFormSubmit, 
    resetForm 
  } = useNewClientForm({ onSubmit, onCancel });

  const renderSection = () => {
    const sectionProps: SectionProps = {
      form,
      countries: COUNTRIES,
      genders: GENDERS,
      idTypes: ID_TYPES,
      handleFileUpload,
      handleFileRemove
    };

    switch (currentSection) {
      case 'personalInfo':
        return <PersonalInfoSection {...sectionProps} />;
      case 'address':
        return <AddressSection {...sectionProps} />;
      case 'contact':
        return <ContactSection {...sectionProps} />;
      case 'identification':
        return <IdentificationSection {...sectionProps} />;
      case 'employment':
        return <EmploymentSection {...sectionProps} />;
      case 'documents':
        return <DocumentsSection {...sectionProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">New Client Registration</h2>
          <p className="text-muted-foreground">
            Please fill out all required information to register a new client.
          </p>
        </div>

        <FormProgress
          currentSection={state.currentSection}
          sections={state.sections}
          sectionTitles={state.sectionTitles}
        />

        <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6" noValidate>
          {renderSection()}

          <FormActions
            isSubmitting={form.formState.isSubmitting}
            onSubmit={handleFormSubmit}
            onCancel={onCancel}
            isFormValid={form.formState.isValid}
          />
        </form>
      </div>
    </Card>
  );
}
