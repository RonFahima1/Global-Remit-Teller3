'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, Building, User } from 'lucide-react';
import { NewClientFormData } from '../../types';

interface EmploymentSectionProps {
  form: UseFormReturn<NewClientFormData>;
}

export function EmploymentSection({ form }: EmploymentSectionProps) {
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
  const EMPLOYMENT_STATUS = [
    { value: 'employed', label: 'Employed' } as const,
    { value: 'self-employed', label: 'Self-employed' } as const,
    { value: 'unemployed', label: 'Unemployed' } as const,
    { value: 'student', label: 'Student' } as const,
    { value: 'retired', label: 'Retired' } as const,
  ] as const;

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
            name="employment.employmentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger className="bg-background pl-10">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYMENT_STATUS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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

        <motion.div custom={1} variants={formAnimation}>
          <FormField
            control={form.control}
            name="employment.employerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employer Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      placeholder="Enter employer name" 
                      className="bg-background pl-10"
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Leave blank if self-employed or unemployed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div custom={2} variants={formAnimation}>
          <FormField
            control={form.control}
            name="employment.occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      {...field} 
                      placeholder="Enter your occupation" 
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
            name="employment.monthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter monthly income"
                      className="bg-background pl-10"
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Approximate amount in USD
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </div>
      
      <motion.div custom={4} variants={formAnimation} className="mt-6">
        <FormDescription className="text-sm text-muted-foreground">
          Employment information is used for KYC verification and to assess transaction risk profiles.
          This information is kept confidential and secure in accordance with our privacy policy.
        </FormDescription>
      </motion.div>
    </motion.div>
  );
}
