'use client';

import { FormField } from '../FormField';

interface AddressSectionProps {
  form: any;
  COUNTRIES: Array<{ value: string; label: string }>;
}

export function AddressSection({ form, COUNTRIES }: AddressSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          form={form}
          name="addressLine1"
          label="Address Line 1"
          type="text"
          required
          helpText="Enter your address line 1"
        />
        <FormField
          form={form}
          name="addressLine2"
          label="Address Line 2"
          type="text"
          helpText="Optional"
        />
        <FormField
          form={form}
          name="city"
          label="City"
          type="text"
          required
          helpText="Enter your city"
        />
        <FormField
          form={form}
          name="state"
          label="State/Province"
          type="text"
          required
          helpText="Enter your state or province"
        />
        <FormField
          form={form}
          name="postalCode"
          label="Postal Code"
          type="text"
          required
          helpText="Enter your postal code"
        />
        <FormField
          form={form}
          name="country"
          label="Country"
          type="select"
          required
          options={COUNTRIES}
        />
      </div>
    </div>
  );
}
