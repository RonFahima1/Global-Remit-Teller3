'use client';

import { z } from 'zod';

interface UseFormProgressProps {
  currentSection: string;
  formSchema: z.ZodSchema;
  formState: any;
}

export function useFormProgress({
  currentSection,
  formSchema,
  formState,
}: UseFormProgressProps) {
  const isFormValid = formState.isValid;

  return { isFormValid };
}
