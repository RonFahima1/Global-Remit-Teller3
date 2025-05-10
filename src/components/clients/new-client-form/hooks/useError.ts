import { useCallback } from 'react';
import { toast } from 'sonner';

export function useError() {
  const handleError = useCallback((error: Error | string) => {
    const errorMessage = error instanceof Error ? error.message : error;
    console.error(errorMessage);
    toast.error(errorMessage, {
      duration: 5000,
      position: 'top-right',
      className: 'bg-red-500 text-white',
    });
  }, []);

  return { handleError };
}
