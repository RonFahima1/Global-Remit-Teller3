'use client';

import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FormSection } from '../types';

interface FormProgressProps {
  currentSection: FormSection;
  sections: FormSection[];
  sectionTitles: Record<string, string>;
}

export function FormProgress({ currentSection, sections, sectionTitles }: FormProgressProps) {
  const totalSections = sections.length;
  const currentSectionIndex = sections.indexOf(currentSection);
  const progressPercentage = Math.round((currentSectionIndex / (totalSections - 1)) * 100);
  
  // Track completed sections
  const [completedSections, setCompletedSections] = useState<FormSection[]>([]);
  
  // Update completed sections when moving to a new section
  useEffect(() => {
    if (currentSectionIndex > 0 && !completedSections.includes(sections[currentSectionIndex - 1])) {
      setCompletedSections(prev => [...prev, sections[currentSectionIndex - 1]]);
    }
  }, [currentSection, currentSectionIndex, sections, completedSections]);

  // Check if a section is completed
  const isSectionCompleted = (section: FormSection) => {
    return completedSections.includes(section);
  };
  
  // Check if a section is active
  const isSectionActive = (section: FormSection) => {
    return section === currentSection;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h3 
          key={currentSection}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-medium text-primary"
        >
          {sectionTitles[currentSection]}
        </motion.h3>
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentSectionIndex + 1} of {totalSections}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="relative">
        <Progress 
          value={progressPercentage} 
          className="h-1.5 bg-gray-100" 
        />
        
        {/* Step indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2">
          {sections.map((section, index) => {
            const isCompleted = isSectionCompleted(section);
            const isActive = isSectionActive(section);
            
            return (
              <motion.div 
                key={section}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: isActive || isCompleted ? 1 : 0.8,
                  opacity: isActive || isCompleted ? 1 : 0.5
                }}
                className="flex flex-col items-center"
              >
                <div 
                  className={`w-4 h-4 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-primary' : isActive ? 'bg-primary' : 'bg-gray-200'}
                  `}
                >
                  {isCompleted && (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  )}
                </div>
                
                <span 
                  className={`text-xs mt-1 hidden sm:block
                    ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}
                  `}
                >
                  {sectionTitles[section]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
