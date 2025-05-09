import { SearchResult } from '@/types/search.types';

export interface SuggestionItem {
  text: string;
  type: 'suggestion' | 'page';
  url?: string;
  icon?: string;
}

export interface QuickAction {
  label: string;
  action: () => void;
}

export interface SearchSectionProps {
  title: string;
  children: React.ReactNode;
  onClear?: () => void;
}

export interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

export interface SuggestionItemProps {
  suggestion: SuggestionItem;
  query: string;
  onClick: (suggestion: SuggestionItem) => void;
  isSelected?: boolean;
}

export interface RecentSearchItemProps {
  query: string;
  onClick: (query: string) => void;
}

export interface PopularSearchItemProps {
  query: string;
  onClick: (query: string) => void;
}

export interface NoResultsProps {
  query: string;
  quickActions: QuickAction[];
  popularSearches: string[];
  onPopularSearchSelect: (query: string) => void;
}

export interface LoadingStateProps {
  message?: string;
}

export interface ErrorStateProps {
  message: string;
}

export interface EmptyStateProps {
  recentSearches: string[];
  popularSearches: string[];
  onRecentSearchSelect: (query: string) => void;
  onClearRecentSearches: () => void;
}

export interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onResultSelect: (result: SearchResult) => void;
}

export interface SearchSuggestionsProps {
  suggestions: SuggestionItem[];
  query: string;
  onSuggestionClick: (suggestion: SuggestionItem) => void;
}

export interface UnifiedSearchUIProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  selectedIndex: number;
  recentSearches: string[];
  popularSearches?: string[];
  onSelectSuggestion: (suggestion: string) => void;
  onResultSelect: (result: SearchResult) => void;
  onRecentSearchSelect: (query: string) => void;
  onClearRecentSearches: () => void;
  className?: string;
}
