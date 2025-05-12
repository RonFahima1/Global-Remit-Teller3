'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';

// Define form schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to request password reset');
      }
      
      setIsSuccess(true);
      toast.success('Password reset link sent to your email');
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#F5F5F7] to-[#E5E5EA] dark:from-gray-900 dark:to-gray-800 pt-8 sm:pt-20 font-['-apple-system','BlinkMacSystemFont','SF Pro Text',sans-serif]">
      <div className="w-full max-w-md p-8 mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <Logo className="h-10 w-auto" />
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
          Reset Your Password
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {isSuccess 
            ? "We've sent you an email with instructions to reset your password." 
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email')}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#0A84FF] hover:bg-[#007AFF]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
            
            <div className="text-center">
              <Link 
                href="/login" 
                className="text-[#0A84FF] hover:text-[#007AFF] text-sm flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-center"
            >
              <div className="rounded-full bg-green-100 p-3">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>
            
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-[#0A84FF] hover:bg-[#007AFF]"
            >
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
