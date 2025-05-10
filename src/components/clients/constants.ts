export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  minLength: (min: number) => `Must be at least ${min} characters`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
} as const;

export const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
] as const;

export const ID_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'drivers_license', label: 'Driver's License' },
  { value: 'national_id', label: 'National ID' },
  { value: 'other', label: 'Other' },
] as const;

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;
