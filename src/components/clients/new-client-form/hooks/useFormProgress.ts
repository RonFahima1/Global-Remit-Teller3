'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';

interface UseFormProgressProps {
  currentSection: string;
  formSchema: z.ZodObject<any>;
  formState: any;
}

export function useFormProgress({ currentSection, formSchema, formState }: UseFormProgressProps) {
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    const currentSectionFields = formSchema.shape[currentSection];
    if (!currentSectionFields) {
      setIsFormValid(true);
      return;
    }

    const fieldErrors = Object.keys(currentSectionFields).some(field => {
      const error = formState.errors[field];
      return error !== undefined;
    });

    setIsFormValid(!fieldErrors);
  }, [currentSection, formSchema, formState.errors]);

  return { isFormValid };
}
