import React, { useState, useEffect } from 'react';
import { SearchSection } from './SearchSection';
import { SuggestionItem } from './SuggestionItem';
import { SearchSuggestionsProps } from '../types';

/**
 * Component for rendering search suggestions
 */
export function SearchSuggestions({ suggestions, query, onSuggestionClick }: SearchSuggestionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            e.preventDefault();
            onSuggestionClick(suggestions[selectedIndex]);
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, onSuggestionClick]);
  
  if (suggestions.length === 0) return null;
  
  return (
    <div className="border-b border-gray-100 dark:border-gray-700">
      <SearchSection title="Suggestions">
        {/* Provide children to SearchSection */}
        <div>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem 
              key={`suggestion-${index}`} // React key, not a prop
              suggestion={suggestion}
              query={query}
              onClick={onSuggestionClick}
              isSelected={index === selectedIndex}
            />
          ))}
        </div>
      </SearchSection>
    </div>
  );
}
