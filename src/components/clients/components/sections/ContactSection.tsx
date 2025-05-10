'use client';

import { FormField } from '../FormField';

interface ContactSectionProps {
  form: any;
}

export function ContactSection({ form }: ContactSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          form={form}
          name="phone"
          label="Phone Number"
          type="tel"
          required
          helpText="Enter your phone number"
        />
        <FormField
          form={form}
          name="email"
          label="Email Address"
          type="email"
          required
          helpText="Enter your email address"
        />
      </div>
    </div>
  );
}
