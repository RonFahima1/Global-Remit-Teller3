'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormFieldComponent } from './FormField';
import { NewClientFormData } from '../types/new-client-form.types';

interface EmploymentSectionProps {
  form: UseFormReturn<NewClientFormData>;
}

export function EmploymentSection({ form }: EmploymentSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldComponent
          form={form}
          name="employment.employer"
          label="Employer *"
          type="text"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="employment.occupation"
          label="Occupation *"
          type="text"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
}
