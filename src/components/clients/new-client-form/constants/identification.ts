export type IDType = {
  value: string;
  label: string;
};

export const ID_TYPES: IDType[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID' },
  { value: 'driver_license', label: 'Driver License' },
  { value: 'residence_permit', label: 'Residence Permit' },
  { value: 'other', label: 'Other' }
];
