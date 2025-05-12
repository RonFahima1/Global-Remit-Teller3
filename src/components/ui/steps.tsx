/**
 * Steps Component
 * A component for displaying a multi-step process with progress tracking
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepProps {
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isLastStep?: boolean;
  className?: string;
}

interface StepsProps {
  currentStep: number;
  className?: string;
  children: React.ReactNode;
}

export function Step({
  title,
  description,
  isCompleted = false,
  isActive = false,
  isLastStep = false,
  className,
}: StepProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
            isActive
              ? 'border-primary bg-primary text-primary-foreground'
              : isCompleted
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground bg-background text-muted-foreground'
          )}
        >
          {isCompleted ? <Check className="h-4 w-4" /> : <span>{title.charAt(0)}</span>}
        </div>
        <div className="mt-2 text-center">
          <div
            className={cn(
              'text-sm font-medium',
              isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {title}
          </div>
          {description && (
            <div
              className={cn(
                'text-xs',
                isActive || isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/60'
              )}
            >
              {description}
            </div>
          )}
        </div>
      </div>
      {!isLastStep && (
        <div
          className={cn(
            'h-[2px] w-full max-w-[100px] bg-muted',
            isCompleted ? 'bg-primary' : 'bg-muted'
          )}
        />
      )}
    </div>
  );
}

export function Steps({ currentStep, className, children }: StepsProps) {
  // Count total steps
  const totalSteps = React.Children.count(children);
  
  // Clone children with additional props
  const stepsWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        isActive: currentStep === index,
        isCompleted: currentStep > index,
        isLastStep: index === totalSteps - 1,
      });
    }
    return child;
  });
  
  return (
    <div className={cn('flex w-full justify-between', className)}>
      {stepsWithProps}
    </div>
  );
}
