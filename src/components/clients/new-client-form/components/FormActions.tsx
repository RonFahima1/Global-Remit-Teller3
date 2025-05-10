'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { NewClientFormData } from '../types/new-client-form.types';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface FormActionsProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  form: UseFormReturn<NewClientFormData>;
  currentSection: string;
  setCurrentSection: (section: string) => void;
  sections: string[];
  isFormValid: boolean;
}

export function FormActions({ 
  isSubmitting, 
  onSubmit, 
  onCancel, 
  form, 
  currentSection, 
  setCurrentSection, 
  sections,
  isFormValid
}: FormActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    } else {
      onSubmit();
    }
  };

  const handlePrevious = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
    }
  };

  const handleCancel = () => {
    if (form.formState.isDirty) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (confirm) {
        onCancel();
        navigate('/clients');
      }
    } else {
      onCancel();
      navigate('/clients');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All data will be lost.')) {
      form.reset();
      setCurrentSection(sections[0]);
      toast({
        title: 'Form Reset',
        description: 'Form has been reset to its initial state.',
      });
    }
  };

  return (
    <div className="flex justify-between items-center gap-4 mt-8">
      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={sections.indexOf(currentSection) === 0 || isSubmitting}
          className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900"
          aria-label="Previous section"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={isSubmitting || !isFormValid}
          className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900"
          aria-label="Next section"
        >
          Next
          <svg className="h-4 w-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
          className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900"
          aria-label="Reset form"
        >
          Reset
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900"
          aria-label="Cancel form"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          aria-label="Submit form"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : currentSection === sections[sections.length - 1] ? (
            'Submit'
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  );
}
