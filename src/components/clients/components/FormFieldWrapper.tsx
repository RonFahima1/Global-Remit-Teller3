import { ReactNode } from 'react';
import { useFormContext } from '../../context/FormContext';
import { FormField } from '../../components/FormField';

interface FormFieldWrapperProps {
  name: string;
  label: string;
  children?: ReactNode;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  isFileUpload?: boolean;
  accept?: string;
  maxSize?: number;
}

export function FormFieldWrapper({
  name,
  label,
  children,
  className = '',
  required = false,
  disabled = false,
  isFileUpload = false,
  accept,
  maxSize
}: FormFieldWrapperProps) {
  const { form, state, handleFileUpload, handleFileRemove } = useFormContext();
  const error = form.formState.errors[name]?.message;
  const fileError = state.errors[name];

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isFileUpload ? (
        <div className="flex flex-col gap-2">
          {children}
          {state.fileUploads[name as keyof typeof state.fileUploads] && (
            <div className="flex items-center gap-2">
              <img
                src={state.fileUploads[name as keyof typeof state.fileUploads]?.previewUrl}
                alt="Uploaded document"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                onClick={() => handleFileRemove(name as keyof typeof state.fileUploads)}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        children || (
          <FormField
            name={name}
            label=""
            control={form.control}
            error={error}
            disabled={disabled}
          />
        )
      )}

      {(error || fileError) && (
        <p className="mt-1 text-sm text-red-600">
          {error || fileError}
        </p>
      )}
    </div>
  );
}
