'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormFieldComponent } from './FormField';
import { ID_TYPES } from '../constants/identification';
import { NewClientFormData } from '../types/new-client-form.types';

interface IdentificationSectionProps {
  form: UseFormReturn<NewClientFormData>;
}

export function IdentificationSection({ form }: IdentificationSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Identification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldComponent
          form={form}
          name="identification.idType"
          label="ID Type *"
          type="select"
          options={ID_TYPES}
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="identification.idNumber"
          label="ID Number *"
          type="text"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="identification.issueDate"
          label="Issue Date *"
          type="date"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="identification.expiryDate"
          label="Expiry Date *"
          type="date"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
}
