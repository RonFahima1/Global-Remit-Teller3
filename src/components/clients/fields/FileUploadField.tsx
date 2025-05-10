import { useFormContext } from '../../context/FormContext';
import { FormFieldWrapper } from '../components/FormFieldWrapper';
import { cn } from '../../lib/utils';

interface FileUploadFieldProps {
  name: string;
  label: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  preview?: boolean;
}

interface UploadedFile {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

export function FileUploadField({
  name,
  label,
  className = '',
  required = false,
  disabled = false,
  accept = 'image/jpeg,image/png,application/pdf',
  maxSize = 5 * 1024 * 1024,
  preview = true
}: FileUploadFieldProps) {
  const { form } = useFormContext();
  const error = form.formState.errors[name]?.message;
  const file = form.getValues(name) as UploadedFile | undefined;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      form.setError(name, {
        type: 'manual',
        message: `File size must be less than ${formatFileSize(maxSize)}`
      });
      return;
    }

    const acceptedTypes = accept.split(',');
    if (!acceptedTypes.includes(file.type)) {
      const typeMap: Record<string, string> = {
        'image/jpeg': 'JPEG',
        'image/png': 'PNG',
        'application/pdf': 'PDF'
      };
      const allowedTypes = acceptedTypes.map(type => typeMap[type] || type.split('/')[1].toUpperCase());
      form.setError(name, {
        type: 'manual',
        message: `Invalid file type. Accepted types: ${allowedTypes.join(', ')}`
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      form.setValue(name, {
        file,
        previewUrl: e.target?.result as string,
        name: file.name,
        size: file.size,
        type: file.type
      } as UploadedFile);
      form.clearErrors(name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      className={className}
      required={required}
      disabled={disabled}
    >
      <div className="flex flex-col gap-2">
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          disabled={disabled}
          className={cn(
            'sr-only',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onChange={handleFileChange}
          aria-invalid={!!error}
          aria-describedby={`${name}-error`}
        />
        <label
          htmlFor={name}
          className={cn(
            'relative flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:text-indigo-500 transition-colors',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={`Upload ${label.toLowerCase()}`}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Choose file</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {accept.split(',').map((type) => {
                const typeMap: Record<string, string> = {
                  'image/jpeg': 'JPEG',
                  'image/png': 'PNG',
                  'application/pdf': 'PDF'
                };
                return typeMap[type] || type.split('/')[1].toUpperCase();
              }).join(', ')}
            </p>
          </div>
          {file && preview && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{file.name}</span>
                <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
              </div>
              {file.type.startsWith('image/') && (
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="mt-2 w-full max-h-48 object-contain rounded-lg"
                />
              )}
            </div>
          )}
        </label>
        {error && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </FormFieldWrapper>
  );
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
                  'application/pdf': 'PDF'
                };
                return typeMap[type as keyof typeof typeMap];
              }).join(', ')}
            </p>
          </div>
        </label>
        {preview && form.getValues(name)?.previewUrl && (
          <div className="mt-2">
            <div className="relative w-full aspect-[4/3]">
              <img
                src={form.getValues(name).previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => form.setValue(name, undefined)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </FormFieldWrapper>
  );
}
