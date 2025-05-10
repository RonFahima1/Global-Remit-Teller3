'use client';

import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

interface FormProgressProps {
  currentSection: string;
  sections: string[];
  sectionTitles: Record<string, string>;
}

export function FormProgress({ currentSection, sections, sectionTitles }: FormProgressProps) {
  const { toast } = useToast();
  const totalSections = sections.length;
  const currentSectionIndex = sections.indexOf(currentSection);
  const progressPercentage = Math.round((currentSectionIndex / (totalSections - 1)) * 100);

  useEffect(() => {
    if (currentSectionIndex > 0) {
      toast({
        title: 'Progress Update',
        description: `Moved to ${sectionTitles[currentSection]}`,
        duration: 2000,
      });
    }
  }, [currentSection, sectionTitles, toast]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {sectionTitles[currentSection]}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {currentSectionIndex + 1} of {totalSections}
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Start</span>
        <span>Finish</span>
      </div>
    </div>
  );
}
