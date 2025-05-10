import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface DocumentsSectionProps {
  form: any;
  handleFileUpload: (file: File, fieldName: string) => void;
  handleFileRemove: (fieldName: string) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  form,
  handleFileUpload,
  handleFileRemove,
}) => {
  const { toast } = useToast();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, fieldName);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supporting Documents
          </label>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => handleFileRemove('supportingDocuments')}>
              Remove Documents
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept="image/*,application/pdf";
                input.onchange = (event) => {
                  const files = event.target.files;
                  if (files) {
                    for (let i = 0; i < files.length; i++) {
                      handleFileUpload(files[i], 'supportingDocuments');
                    }
                  }
                };
                input.click();
              }}
            >
              Upload Documents
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information
          </label>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => handleFileRemove('additionalInfo')}>
              Remove Additional Info
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept="image/*,application/pdf";
                input.onchange = (event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, 'additionalInfo');
                  }
                };
                input.click();
              }}
            >
              Upload Additional Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
