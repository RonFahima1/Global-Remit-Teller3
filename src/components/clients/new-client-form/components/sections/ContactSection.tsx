'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Phone, User } from 'lucide-react';
import { NewClientFormData } from '../../types';

interface ContactSectionProps {
  form: UseFormReturn<NewClientFormData>;
  countries: { value: string; label: string }[];
  idTypes: { value: string; label: string }[];
  handleFileUpload?: (field: string, file: File) => Promise<void>;
  handleFileRemove?: (field: string) => void;
}

export function ContactSection({ form }: ContactSectionProps) {
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
            name="contact.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      type="email"
                      required 
                      placeholder="Enter email address" 
                      className="bg-background pl-10" 
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Used for transaction notifications and account updates
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div custom={1} variants={formAnimation}>
          <FormField
            control={form.control}
            name="contact.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      type="tel"
                      required 
                      placeholder="+1 (555) 123-4567" 
                      className="bg-background pl-10" 
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Include country code (e.g., +1 for US)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div custom={2} variants={formAnimation}>
          <FormField
            control={form.control}
            name="contact.emergencyContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      required 
                      placeholder="Enter emergency contact name" 
                      className="bg-background pl-10" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div custom={3} variants={formAnimation}>
          <FormField
            control={form.control}
            name="contact.emergencyContactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Phone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      type="tel"
                      required 
                      placeholder="+1 (555) 123-4567" 
                      className="bg-background pl-10" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </div>
      
      <motion.div custom={4} variants={formAnimation} className="mt-6">
        <FormDescription className="text-sm text-muted-foreground">
          Contact information is essential for account security and transaction notifications.
          We may use these details to verify your identity when processing transactions.
        </FormDescription>
      </motion.div>
    </motion.div>
  );
}
