'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
// Import toast from shadcn/ui or create a custom toast component
import { toast } from '@/lib/toast';
import { motion } from 'framer-motion';
import { FileText, Calendar, CreditCard, Upload, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { NewClientFormData } from '../../types';

interface IdentificationSectionProps {
  form: UseFormReturn<NewClientFormData>;
  idTypes: { value: string; label: string }[];
  handleFileUpload?: (field: string, file: File) => Promise<void>;
  handleFileRemove?: (field: string) => void;
}

export function IdentificationSection({
  form,
  idTypes,
  handleFileUpload,
  handleFileRemove,
}: IdentificationSectionProps) {
  // Animation variants for form fields
  const formAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };
  // No need to destructure toast if importing directly

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div custom={0} variants={formAnimation}>
          <FormField
            control={form.control}
            name="identification.idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      required 
                      placeholder="Enter your ID number" 
                      className="bg-background pl-10"
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  The number on your identification document
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div custom={1} variants={formAnimation}>
          <FormField
            control={form.control}
            name="identification.idType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Type</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger className="bg-background pl-10">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        {idTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div custom={2} variants={formAnimation}>
          <FormField
            control={form.control}
            name="identification.idExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Expiry Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="date"
                      required
                      placeholder="Enter ID expiry date"
                      className="bg-background pl-10"
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Must be a future date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </div>

      <motion.div custom={3} variants={formAnimation} className="mt-6">
        <FormField
          control={form.control}
          name="identification.documentFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Document Upload</FormLabel>
              <FormDescription className="text-sm mb-2">
                Upload a clear scan or photo of your identification document
              </FormDescription>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept="image/*,application/pdf";
                    input.onchange = (event) => {
                      const file = (event.target as HTMLInputElement).files?.[0];
                      if (file && handleFileUpload) {
                        handleFileUpload('identification.documentFile', file);
                      }
                    };
                    input.click();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
                {field.value && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => handleFileRemove && handleFileRemove('identification.documentFile')}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove File
                  </Button>
                )}
                {field.value && (
                  <span className="text-sm text-muted-foreground">
                    {typeof field.value === 'string' 
                      ? String(field.value).split('/').pop() 
                      : (field.value as File)?.name}
                  </span>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
      
      <motion.div custom={4} variants={formAnimation} className="mt-6">
        <FormDescription className="text-sm text-muted-foreground">
          Your identification documents are required for KYC (Know Your Customer) verification.
          All documents are securely stored and handled according to our privacy policy.
        </FormDescription>
      </motion.div>
    </motion.div>
  );
}
