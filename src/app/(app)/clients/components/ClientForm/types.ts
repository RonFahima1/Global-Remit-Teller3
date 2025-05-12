// Client form types
export interface ClientFormValues {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Contact Information
  contact: {
    email: string;
    phone: string;
    alternatePhone?: string;
  };
  
  // Identification Information
  identification: {
    type: string;
    number: string;
    issuingCountry: string;
    issueDate: string;
    expiryDate: string;
  };
  
  // Risk and KYC Information
  kycStatus: 'pending' | 'verified' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
}
