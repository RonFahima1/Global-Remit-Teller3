'use client';

import { FormField } from '../FormField';

interface IdentificationSectionProps {
  form: any;
  ID_TYPES: Array<{ value: string; label: string }>;
}

export function IdentificationSection({ form, ID_TYPES }: IdentificationSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          form={form}
          name="nationality"
          label="Nationality"
          type="text"
          required
          helpText="Enter your nationality"
        />
        <FormField
          form={form}
          name="idType"
          label="ID Type"
          type="select"
          required
          options={ID_TYPES}
        />
        <FormField
          form={form}
          name="idNumber"
          label="ID Number"
          type="text"
          required
          helpText="Enter your ID number"
        />
      </div>
    </div>
  );
}
