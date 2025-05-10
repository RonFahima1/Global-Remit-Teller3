'use client';

import { FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { FormFieldComponent } from './FormField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';

interface PersonalInfoSectionProps {
  form: UseFormReturn<any>;
  className?: string;
}

export function PersonalInfoSection({ form }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldComponent
          form={form}
          name="firstName"
          label="First Name *"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="middleName"
          label="Middle Name"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
        />
        <FormFieldComponent
          form={form}
          name="lastName"
          label="Last Name *"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="dob"
          label="Date of Birth *"
          type="date"
          className="input-ios focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <FormFieldComponent
          form={form}
          name="gender"
          label="Gender *"
          type="select"
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
          ]}
          className="input-ios focus:ring-primary"
          required
        />
        <FormFieldComponent
          form={form}
          name="nationality"
          label="Nationality *"
          className="input-ios focus:ring-primary"
          required
        />
      </div>
    </div>
  );
}
