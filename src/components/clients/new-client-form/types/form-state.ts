export type SectionName = 'personalInfo' | 'address' | 'contact' | 'identification' | 'employment' | 'documents';

export interface FormState {
  currentSection: SectionName;
  sections: readonly SectionName[];
  sectionTitles: Record<SectionName, string>;
  isFormValid: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  isFailed: boolean;
  successMessage: string | undefined;
  errorMessage: string | undefined;
}

export interface FormError {
  field: string;
  message: string;
}
