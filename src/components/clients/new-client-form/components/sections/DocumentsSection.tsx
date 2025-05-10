'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { motion } from 'framer-motion';
import { FileText, Upload, Trash2, FilePlus, FileCheck } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { NewClientFormData } from '../../types';
import { toast } from '@/lib/toast';

interface DocumentsSectionProps {
  form: UseFormReturn<NewClientFormData>;
  handleFileUpload?: (field: string, file: File) => Promise<void>;
  handleFileRemove?: (field: string) => void;
}

export function DocumentsSection({
  form,
  handleFileUpload,
  handleFileRemove,
}: DocumentsSectionProps) {
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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file && handleFileUpload) {
      handleFileUpload(fieldName, file)
        .then(() => toast.success(`File ${file.name} uploaded successfully`))
        .catch(() => toast.error(`Failed to upload ${file.name}`));
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6">
        <motion.div custom={0} variants={formAnimation}>
          <FormField
            control={form.control}
            name="documents.proofOfAddress"
            render={({ field }) => (
              <FormItem className="bg-muted/20 p-4 rounded-lg">
                <FormLabel className="text-base">Proof of Address</FormLabel>
                <FormDescription className="text-sm mb-2">
                  Upload a utility bill, bank statement, or government letter (less than 3 months old)
                </FormDescription>
                <FormControl>
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
                            handleFileUpload('documents.proofOfAddress', file)
                              .then(() => toast.success(`Proof of address uploaded successfully`))
                              .catch(() => toast.error(`Failed to upload proof of address`));
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
                        onClick={() => handleFileRemove && handleFileRemove('documents.proofOfAddress')}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove File
                      </Button>
                    )}
                    {field.value && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                        {typeof field.value === 'string' 
                          ? String(field.value).split('/').pop() 
                          : (field.value as File)?.name}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div custom={1} variants={formAnimation}>
          <FormField
            control={form.control}
            name="documents.financialDocuments"
            render={({ field }) => (
              <FormItem className="bg-muted/20 p-4 rounded-lg">
                <FormLabel className="text-base">Financial Documents</FormLabel>
                <FormDescription className="text-sm mb-2">
                  Upload bank statements, pay stubs, or other proof of income
                </FormDescription>
                <FormControl>
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
                            handleFileUpload('documents.financialDocuments', file)
                              .then(() => toast.success(`Financial document uploaded successfully`))
                              .catch(() => toast.error(`Failed to upload financial document`));
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
                        onClick={() => handleFileRemove && handleFileRemove('documents.financialDocuments')}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove File
                      </Button>
                    )}
                    {field.value && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                        {typeof field.value === 'string' 
                          ? String(field.value).split('/').pop() 
                          : (field.value as File)?.name}
                      </div>
                    )}
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
            name="documents.additionalDocuments"
            render={({ field }) => (
              <FormItem className="bg-muted/20 p-4 rounded-lg">
                <FormLabel className="text-base">Additional Documents</FormLabel>
                <FormDescription className="text-sm mb-2">
                  Upload any other supporting documents that may be relevant
                </FormDescription>
                <FormControl>
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
                            handleFileUpload('documents.additionalDocuments', file)
                              .then(() => toast.success(`Additional document uploaded successfully`))
                              .catch(() => toast.error(`Failed to upload additional document`));
                          }
                        };
                        input.click();
                      }}
                    >
                      <FilePlus className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                    {field.value && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => handleFileRemove && handleFileRemove('documents.additionalDocuments')}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove File
                      </Button>
                    )}
                    {field.value && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                        {typeof field.value === 'string' 
                          ? String(field.value).split('/').pop() 
                          : (field.value as File)?.name}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </div>
      
      <motion.div custom={3} variants={formAnimation} className="mt-6">
        <FormDescription className="text-sm text-muted-foreground">
          All documents are securely stored and handled according to our privacy policy.
          Documents help us verify your identity and process transactions more efficiently.
        </FormDescription>
      </motion.div>
    </motion.div>
  );
}
