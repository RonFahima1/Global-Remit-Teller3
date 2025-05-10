'use client';

import { FormField } from '../FormField';

interface PersonalInfoSectionProps {
  form: any;
  GENDERS: Array<{ value: string; label: string }>;
}

export function PersonalInfoSection({ form, GENDERS }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          form={form}
          name="firstName"
          label="First Name"
          type="text"
          required
          helpText="Enter your first name"
        />
        <FormField
          form={form}
          name="middleName"
          label="Middle Name"
          type="text"
          helpText="Optional"
        />
        <FormField
          form={form}
          name="lastName"
          label="Last Name"
          type="text"
          required
          helpText="Enter your last name"
        />
        <FormField
          form={form}
          name="dob"
          label="Date of Birth"
          type="date"
          required
          helpText="Select your date of birth"
        />
        <FormField
          form={form}
          name="gender"
          label="Gender"
          type="select"
          required
          options={GENDERS}
        />
      </div>
    </div>
  );
}
