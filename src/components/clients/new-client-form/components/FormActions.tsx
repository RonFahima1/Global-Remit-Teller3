'use client';

import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight, Save, RotateCcw, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface FormActionsProps {
  isSubmitting: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  isFormValid: boolean;
}

export function FormActions({ 
  isSubmitting, 
  isLastStep,
  onNext, 
  onPrevious,
  onSubmit, 
  onCancel, 
  isFormValid
}: FormActionsProps) {
  const { toast } = useToast();
  
  const handleCancel = () => {
    // Confirm before canceling if there are changes
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      onCancel();
    }
  };

  return (
    <motion.div 
      className="flex flex-wrap justify-between items-center gap-4 mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Left side - Back button */}
      <div className="flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
          size="sm"
          className="flex items-center gap-1 text-sm"
          aria-label="Previous section"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          size="sm"
          className="flex items-center gap-1 text-sm"
          aria-label="Cancel form"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </Button>

        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !isFormValid}
            size="sm"
            className="flex items-center gap-1 text-sm bg-primary"
            aria-label="Submit form"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Submit</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting || !isFormValid}
            size="sm"
            className="flex items-center gap-1 text-sm"
            aria-label="Next section"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
