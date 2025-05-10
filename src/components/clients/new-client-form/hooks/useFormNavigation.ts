'use client';

import { useCallback } from 'react';
import type { FormSection } from '../types';

interface UseFormNavigationProps {
  sections: FormSection[];
  currentSection: FormSection;
  updateCurrentSection: (section: FormSection) => void;
  isFormValid?: boolean;
  isSubmitting?: boolean;
  onSubmit?: () => void;
}

export function useFormNavigation({
  sections,
  currentSection,
  updateCurrentSection,
  isFormValid = true,
  isSubmitting = false,
  onSubmit = () => {}
}: UseFormNavigationProps) {
  const handleNext = useCallback(() => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      updateCurrentSection(sections[currentIndex + 1]);
    } else if (isFormValid && !isSubmitting) {
      onSubmit();
    }
  }, [currentSection, updateCurrentSection, sections, onSubmit, isFormValid, isSubmitting]);

  const handlePrevious = useCallback(() => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      updateCurrentSection(sections[currentIndex - 1]);
    }
  }, [currentSection, updateCurrentSection, sections]);
  
  const goToSection = useCallback((section: FormSection) => {
    if (sections.includes(section)) {
      updateCurrentSection(section);
    }
  }, [sections, updateCurrentSection]);

  return { handleNext, handlePrevious, goToSection };
}
