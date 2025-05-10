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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { COUNTRIES } from './constants/countries';
import { ID_TYPES } from './constants/identification';
import type { NewClientFormProps } from './types';
import type { FormSection } from './types';

export function NewClientForm({ onSubmit, onCancel, isLoading, initialData }: NewClientFormProps) {
  const { 
    form, 
    state, 
    handleFileUpload, 
    handleFileRemove, 
    handleFormSubmit, 
    handleNext,
    handlePrevious,
    resetForm,
    sectionConfig
  } = useNewClientForm({ 
    onSubmit, 
    onCancel, 
    isLoading, 
    initialData 
  });

  // Render the appropriate section based on current step
  const renderSection = () => {
    const sectionProps = {
      form,
      countries: COUNTRIES,
      idTypes: ID_TYPES,
      handleFileUpload,
      handleFileRemove
    };

    switch (state.currentSection) {
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
  
  // Render form errors or success messages
  const renderFormStatus = () => {
    if (state.formError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.formError}</AlertDescription>
          </Alert>
        </motion.div>
      );
    }
    
    if (state.formSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="success" className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{state.formSuccess}</AlertDescription>
          </Alert>
        </motion.div>
      );
    }
    
    return null;
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
        
        <AnimatePresence mode="wait">
          {renderFormStatus()}
        </AnimatePresence>

        <FormProgress
          currentSection={state.currentSection}
          sections={sectionConfig.sections as FormSection[]}
          sectionTitles={sectionConfig.sectionTitles}
        />

        <motion.div
          key={state.currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <form className="space-y-6" noValidate>
            {renderSection()}

            <FormActions
              isSubmitting={state.isSubmitting}
              isLastStep={state.currentSection === sectionConfig.sections[sectionConfig.sections.length - 1]}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              onCancel={onCancel}
              isFormValid={form.formState.isValid}
            />
          </form>
        </motion.div>
      </div>
    </Card>
  );
}
