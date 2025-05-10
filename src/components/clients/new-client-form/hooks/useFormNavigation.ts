'use client';

import { useCallback } from 'react';

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
  onSubmit
}: UseFormNavigationProps) {
  const handleNext = useCallback(() => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    } else {
      onSubmit();
    }
  }, [currentSection, setCurrentSection, sections, onSubmit]);

  const handlePrevious = useCallback(() => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
    }
  }, [currentSection, setCurrentSection, sections]);

  return { handleNext, handlePrevious };
}
