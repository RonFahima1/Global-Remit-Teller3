import { useFormContext } from '../context/FormContext';
import { FormField } from '../components/FormField';

export function GenderField() {
  const { form } = useFormContext();

  const GENDER_OPTIONS = [
    { value: '', label: 'Select gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <FormField
      name="personal.gender"
      label="Gender"
      control={form.control}
      error={form.formState.errors.personal?.gender?.message}
      as="select"
      options={GENDER_OPTIONS}
    />
  );
}
