import React from 'react';
import { Search, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoResultsProps } from '../types';

/**
 * Component displayed when no search results are found
 */
export function NoResults({ query, quickActions, popularSearches, onPopularSearchSelect }: NoResultsProps) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center text-center mb-5">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
          <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-1">No results found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No matches found for "{query}"
        </p>
      </div>
      
      {/* Quick actions */}
      <div className="mb-5">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={`action-${index}`}
              variant="outline"
              size="sm"
              className="justify-start text-sm"
              onClick={action.action}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Try these searches */}
      <div>
        <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
          <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
          Try these searches
        </div>
        <div className="space-y-2">
          {popularSearches.map((suggestion, index) => (
            <div
              key={`suggestion-${index}`}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onPopularSearchSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
