import { useFormContext } from '../../context/FormContext';
import { BaseField } from './BaseField';
import { FormField } from '../components/FormField';

interface DateFieldProps {
  name: string;
  label: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  format?: string;
}

export function DateField({
  name,
  label,
  className = '',
  required = false,
  disabled = false,
  minDate,
  maxDate,
  placeholder = 'Select date',
  format = 'yyyy-MM-dd'
}: DateFieldProps) {
  const { form } = useFormContext();
  const error = form.formState.errors[name]?.message;

  return (
    <BaseField
      name={name}
      label={label}
      className={className}
      required={required}
      disabled={disabled}
    >
      <FormField
        name={name}
        control={form.control}
        type="date"
        error={error}
        disabled={disabled}
        min={minDate}
        max={maxDate}
        placeholder={placeholder}
        format={format}
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={`${name}-error`}
      />
    </BaseField>
  );
}
