'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentText, Trash2 } from 'lucide-react';

interface DocumentsSectionProps {
  form: any;
  handleFileUpload: (file: File) => void;
  handleFileRemove: (index: number) => void;
}

export function DocumentsSection({
  form,
  handleFileUpload,
  handleFileRemove,
}: DocumentsSectionProps) {
  const documents = form.watch('documents') || [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="documentUpload">Upload Documents</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              id="documentUpload"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <Button type="button" onClick={() => document.getElementById('documentUpload')?.click()}>
              <DocumentText className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </div>
        </div>

        {documents.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {documents.map((file: File, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm font-medium">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFileRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
