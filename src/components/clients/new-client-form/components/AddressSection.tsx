'use client';

import { FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFieldComponent } from './FormField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { UseFormReturn, Control, FormState } from 'react-hook-form';
import type { NewClientFormData } from '@/components/clients/new-client-form/types';
import { COUNTRIES } from '../constants/countries';

interface AddressSectionProps {
  form: UseFormReturn<NewClientFormData>;
}

export function AddressSection({ form }: AddressSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldComponent
          form={form}
          name="country"
          label="Country"
          type="select"
          options={COUNTRIES}
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="streetAddress"
          label="Street Address *"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="city"
          label="City *"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="postalCode"
          label="Postal Code *"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
}
