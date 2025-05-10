'use client';

import { useState } from 'react';

interface UseFormNavigationProps {
  sections: string[];
  currentSection: string;
  setCurrentSection: (section: string) => void;
  isFormValid: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function useFormNavigation({
  sections,
  currentSection,
  setCurrentSection,
  isFormValid,
  isSubmitting,
  onSubmit,
}: UseFormNavigationProps) {
  const currentIndex = sections.indexOf(currentSection);
  const isLastSection = currentIndex === sections.length - 1;

  const handleNext = () => {
    if (!isFormValid || isSubmitting) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < sections.length) {
      setCurrentSection(sections[nextIndex]);
    } else {
      onSubmit();
    }
  };

  const handlePrevious = () => {
    if (isSubmitting) return;
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentSection(sections[prevIndex]);
    }
  };

  return {
    handleNext,
    handlePrevious,
  };
}
