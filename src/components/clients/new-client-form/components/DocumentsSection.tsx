'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormFieldComponent } from './FormField';
import { NewClientFormData } from '../types/new-client-form.types';

interface DocumentsSectionProps {
  form: UseFormReturn<NewClientFormData>;
}

export function DocumentsSection({ form }: DocumentsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormFieldComponent
          form={form}
          name="documents.idDocument"
          label="ID Document *"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="documents.proofOfAddress"
          label="Proof of Address *"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <p className="text-sm text-gray-500">
        Supported formats: JPG, JPEG, PNG, WEBP, PDF
      </p>
    </div>
  );
}
