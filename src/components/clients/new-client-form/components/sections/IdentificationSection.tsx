import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface IdentificationSectionProps {
  form: any;
  ID_TYPES: { value: string; label: string }[];
  handleFileUpload: (file: File, fieldName: string) => void;
  handleFileRemove: (fieldName: string) => void;
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  form,
  ID_TYPES,
  handleFileUpload,
  handleFileRemove,
}) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input {...field} required placeholder="Enter your ID number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ID_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Expiry Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  required
                  placeholder="Enter ID expiry date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => handleFileRemove('idDocument')}>
          Remove ID Document
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
                handleFileUpload(file, 'idDocument');
              }
            };
            input.click();
          }}
        >
          Upload ID Document
        </Button>
      </div>
    </div>
  );
}
