'use client';

import { Progress } from '@/components/ui/progress';
import { useScreenReader } from '@/hooks/use-screen-reader';

interface FormProgressProps {
  currentSection: string;
  sections: string[];
  sectionTitles: Record<string, string>;
}

export function FormProgress({
  currentSection,
  sections,
  sectionTitles,
}: FormProgressProps) {
  const { announce } = useScreenReader();
  const currentIndex = sections.indexOf(currentSection);
  const totalSections = sections.length;
  const progress = ((currentIndex + 1) / totalSections) * 100;

  useEffect(() => {
    announce(`You are on ${sectionTitles[currentSection]} section. Progress: ${Math.round(progress)}%`);
  }, [currentSection, announce, sectionTitles, progress]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Step {currentIndex + 1} of {totalSections}
        </span>
        <span className="text-sm font-medium">
          {sectionTitles[currentSection]}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
