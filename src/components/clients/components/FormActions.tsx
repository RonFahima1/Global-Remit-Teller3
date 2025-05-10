'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FormActionsProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  form: any;
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
  isFormValid,
}: FormActionsProps) {
  const { toast } = useToast();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
      form.reset();
      toast({
        title: 'Form Reset',
        description: 'Form has been reset successfully',
      });
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      onCancel();
    }
  };

  const currentIndex = sections.indexOf(currentSection);
  const isLastSection = currentIndex === sections.length - 1;

  return (
    <div className="flex justify-end space-x-4 mt-8">
      <Button variant="outline" onClick={handleReset} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          'Reset'
        )}
      </Button>
      <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Canceling...
          </>
        ) : (
          'Cancel'
        )}
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || !isFormValid}
        className="bg-primary hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : isLastSection ? (
          'Submit'
        ) : (
          'Next'
        )}
      </Button>
    </div>
  );
}
