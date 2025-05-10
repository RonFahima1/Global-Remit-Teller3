'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useController } from 'react-hook-form';

interface FormFieldProps {
  form: any;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
  className?: string;
}

export function FormField({
  form,
  name,
  label,
  type = 'text',
  required = false,
  options,
  helpText,
  className = '',
}: FormFieldProps) {
  const {
    field: { ref, ...field },
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  });

  const errorText = error?.message as string;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {helpText && (
          <span className="text-sm text-gray-500">{helpText}</span>
        )}
      </div>

      {type === 'select' ? (
        <Select
          {...field}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        >
          {options?.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      ) : type === 'textarea' ? (
        <Textarea
          {...field}
          ref={ref}
          id={name}
          placeholder={helpText}
          className={`w-full ${error ? 'border-red-500' : ''}`}
        />
      ) : (
        <Input
          {...field}
          ref={ref}
          id={name}
          type={type}
          placeholder={helpText}
          className={`w-full ${error ? 'border-red-500' : ''}`}
        />
      )}

      {errorText && (
        <p className="text-sm text-red-500 mt-1">{errorText}</p>
      )}
    </div>
  );
}
