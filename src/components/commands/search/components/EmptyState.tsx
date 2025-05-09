import React from 'react';
import { SearchSection } from './SearchSection';
import { RecentSearchItem } from './RecentSearchItem';
import { PopularSearchItem } from './PopularSearchItem';
import { EmptyStateProps } from '../types';

/**
 * Component displayed when search query is empty
 */
export function EmptyState({ 
  recentSearches, 
  popularSearches, 
  onRecentSearchSelect, 
  onClearRecentSearches 
}: EmptyStateProps) {
  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {/* Recent searches section */}
      <SearchSection 
        title="Recent Searches" 
        onClear={recentSearches.length > 0 ? onClearRecentSearches : undefined}
      >
        {recentSearches.length > 0 ? (
          <div>
            {recentSearches.slice(0, 5).map((query, index) => (
              <RecentSearchItem 
                key={`recent-${index}`}
                query={query}
                onClick={onRecentSearchSelect}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
            No recent searches
          </div>
        )}
      </SearchSection>
      
      {/* Popular searches section */}
      <SearchSection title="Popular Searches">
        <div>
          {popularSearches.map((query, index) => (
            <PopularSearchItem 
              key={`popular-${index}`}
              query={query}
              onClick={onRecentSearchSelect}
            />
          ))}
        </div>
      </SearchSection>
    </div>
  );
}
