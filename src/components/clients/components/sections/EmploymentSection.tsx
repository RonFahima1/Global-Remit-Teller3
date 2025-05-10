'use client';

import { FormField } from '../FormField';

interface EmploymentSectionProps {
  form: any;
}

export function EmploymentSection({ form }: EmploymentSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          form={form}
          name="occupation"
          label="Occupation"
          type="text"
          required
          helpText="Enter your occupation"
        />
        <FormField
          form={form}
          name="employer"
          label="Employer"
          type="text"
          required
          helpText="Enter your employer's name"
        />
      </div>
    </div>
  );
}
