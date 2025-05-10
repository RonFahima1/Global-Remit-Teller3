import { useFormContext } from '../context/FormContext';
import { FormField } from '../components/FormField';
import { COUNTRIES } from '../constants/countries';

export function NationalityField() {
  const { form } = useFormContext();

  return (
    <FormField
      name="personal.nationality"
      label="Nationality"
      control={form.control}
      error={form.formState.errors.personal?.nationality?.message}
      as="select"
      options={COUNTRIES.map(country => ({
        value: country.value,
        label: country.label
      }))}
    />
  );
}
