import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface FileUploadState {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  isUploading: boolean;
}

export function useFileUpload(
  maxSize: number,
  acceptedTypes: string[]
): {
  state: FileUploadState;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
} {
  const { toast } = useToast();
  const [state, setState] = useState<FileUploadState>({
    file: null,
    previewUrl: null,
    error: null,
    isUploading: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize) {
      setState(prev => ({ ...prev, error: 'File is too large' }));
      toast({
        title: 'File too large',
        description: `Please upload a file smaller than ${Math.round(maxSize / 1024 / 1024)}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setState(prev => ({ ...prev, error: 'Invalid file type' }));
      toast({
        title: 'Invalid file type',
        description: `Please upload a file with one of these types: ${acceptedTypes.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setState({
      file,
      previewUrl,
      error: null,
      isUploading: false,
    });
  };

  const reset = () => {
    setState({
      file: null,
      previewUrl: null,
      error: null,
      isUploading: false,
    });
  };

  return { state, handleFileChange, reset };
}
