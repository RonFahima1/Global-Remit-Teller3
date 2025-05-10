'use client';

import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormField } from "@/hooks/use-form-field";
import { useError } from "./hooks/useError";

export interface FormFieldComponentProps {
  form: any;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'select' | 'file' | 'date' | 'tel';
  options?: Array<{ value: string; label: string }>;
  accept?: string;
  required?: boolean;
  className?: string;
  [key: string]: any;
}

export function FormFieldComponent({
  form,
  name,
  label,
  type = 'text',
  options,
  accept,
  required = false,
  className = '',
  helpText,
  characterCount,
  maxCharacterCount,
  showPassword,
  onTogglePassword,
  isLoading = false,
  isDisabled = false,
  ...props
}: FormFieldComponentProps) {
  const { field, formState } = useFormField({ name });
  const { handleError } = useError();
  const error = formState?.errors?.[name];
  const value = form.getValues(name);
  const isFileInput = type === 'file';
  const isPasswordInput = type === 'password';

  const handlePasswordToggle = useCallback(() => {
    if (onTogglePassword) {
      onTogglePassword();
    }
  }, [onTogglePassword]);

  return (
    <FormItem className={cn(
      "space-y-2",
      "bg-white rounded-lg p-4",
      "border border-gray-200",
      "hover:border-gray-300 transition-colors",
      error && "border-red-500",
      isDisabled && "opacity-50 cursor-not-allowed",
      isLoading && "opacity-75",
      className
    )}>
      <div className="flex items-center justify-between">
        <FormLabel htmlFor={name} className="text-gray-700 text-sm font-medium">
          {label}
          {required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </FormLabel>
        {error && (
          <span className="text-xs text-red-500">
            {error.message}
          </span>
        )}
      </div>

      <div className="relative">
        <FormControl>
          {type === 'select' ? (
            <Select {...field}>
              <SelectTrigger className={cn(
                "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all duration-200",
                error && "border-red-500",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-md py-1 shadow-lg">
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : isFileInput ? (
            <FileUpload
              value={value}
              onChange={(file: File) => form.setValue(name, file)}
              accept={accept}
              className={cn(
                "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all duration-200",
                error && "border-red-500",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
              disabled={isDisabled}
              loading={isLoading}
            />
          ) : type === 'date' ? (
            <Input
              {...field}
              id={name}
              type="date"
              className={cn(
                "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all duration-200",
                error && "border-red-500",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
              disabled={isDisabled}
              {...props}
            />
          ) : isPasswordInput ? (
            <div className="relative">
              <Input
                {...field}
                id={name}
                type={showPassword ? 'text' : 'password'}
                className={cn(
                  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all duration-200",
                  error && "border-red-500",
                  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                )}
                disabled={isDisabled}
                {...props}
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isDisabled}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          ) : (
            <Input
              {...field}
              id={name}
              type={type}
              className={cn(
                "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all duration-200",
                error && "border-red-500",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
              disabled={isDisabled}
              {...props}
            />
          )}
        </FormControl>

        {helpText && (
          <p className="mt-1 text-xs text-gray-500">
            {helpText}
          </p>
        )}

        {maxCharacterCount && !isFileInput && !isPasswordInput && (
          <p className="mt-1 text-xs text-gray-500">
            {characterCount}/{maxCharacterCount} characters
          </p>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
    </FormItem>
  );
        ) : (
          <Input
            {...field}
            id={name}
            type={type}
            className={cn(
              "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-all duration-200",
              error && "border-red-500",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            )}
            {...props}
          />
        )}
      </FormControl>
    </FormItem>
  );
}
