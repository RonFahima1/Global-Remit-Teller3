'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Phone, Mail } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from './types';

interface ContactSectionProps {
  form: UseFormReturn<ClientFormValues>;
}

export function ContactSection({ form }: ContactSectionProps) {
  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-500" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="contact.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="email" 
                    placeholder="Enter email address" 
                    {...field} 
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="tel" 
                    placeholder="Enter phone number" 
                    {...field} 
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contact.alternatePhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternate Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="Enter alternate phone number" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
