/**
 * Validation constants for the new client form
 */

// File upload validation
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf'
];

// Validation messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  date: 'Please enter a valid date',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  pattern: 'Please enter a valid value',
  fileSize: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  fileType: 'File must be JPEG, PNG, or PDF',
  postalCode: 'Please enter a valid postal code',
  idNumber: 'Please enter a valid ID number',
  income: 'Please enter a valid income amount',
  futureDate: 'Date must be in the future',
  pastDate: 'Date must be in the past',
  minAge: (age: number) => `Must be at least ${age} years old`,
  maxAge: (age: number) => `Must be at most ${age} years old`,
  passwordMatch: 'Passwords must match',
  invalidCharacters: 'Contains invalid characters'
};

// Regex patterns
export const PATTERNS = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^\+?[0-9]{10,15}$/,
  postalCode: /^[0-9]{5,7}$/,
  alphanumeric: /^[a-zA-Z0-9\s]*$/,
  letters: /^[a-zA-Z\s]*$/,
  numbers: /^[0-9]*$/
};

// Validation rules
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: PATTERNS.letters
  },
  email: {
    required: true,
    pattern: PATTERNS.email
  },
  phone: {
    required: true,
    pattern: PATTERNS.phone
  },
  postalCode: {
    required: true,
    pattern: PATTERNS.postalCode
  },
  idNumber: {
    required: true,
    minLength: 5,
    maxLength: 20
  },
  address: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  income: {
    required: true,
    min: 0
  }
};
