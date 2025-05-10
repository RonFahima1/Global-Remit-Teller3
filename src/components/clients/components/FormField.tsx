import { Control } from 'react-hook-form';
import { cn } from '../../../utils/cn';

interface FormFieldProps {
  name: string;
  label: string;
  control: Control;
  error: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

export function FormField({
  name,
  label,
  control,
  error,
  type = 'text',
  placeholder = '',
  className = '',
  disabled = false,
  required = false,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid
}: FormFieldProps) {
  const register = control.register;

  const commonProps = {
    ...register(name),
    className: cn(
      'block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/30 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200',
      error ? 'border-red-500' : '',
      disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
      className
    ),
    placeholder,
    disabled,
    required,
    'aria-label': ariaLabel || label,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid || !!error
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <input
          type={type}
          {...commonProps}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
