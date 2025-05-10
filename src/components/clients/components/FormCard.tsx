import { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FormCard({ title, children, className = '' }: FormCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800/20 rounded-xl shadow-sm dark:shadow-md p-6 ${className} flex flex-col max-h-[600px]`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="flex-grow flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
        <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
