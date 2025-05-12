/**
 * Exchange Rate Table Component
 * Displays a table of exchange rates with filtering and sorting
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  ArrowUpDown,
  RefreshCw,
  Search,
  Edit,
  Plus,
  Filter
} from 'lucide-react';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { ExchangeRate, ExchangeRateSource } from '@/types/exchange-rate';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

/**
 * Exchange Rate Table Props
 */
interface ExchangeRateTableProps {
  onEditRate: (rate: ExchangeRate) => void;
  onCreateRate: () => void;
}

/**
 * Exchange Rate Table Component
 */
export function ExchangeRateTable({ onEditRate, onCreateRate }: ExchangeRateTableProps) {
  const { 
    rates, 
    isLoading, 
    error, 
    lastUpdated,
    loadAllRates,
    loadRatesByFilter
  } = useExchangeRates();
  
  // State for filtering and sorting
  const [filteredRates, setFilteredRates] = useState<ExchangeRate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [baseCurrencyFilter, setBaseCurrencyFilter] = useState<string>('');
  const [targetCurrencyFilter, setTargetCurrencyFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof ExchangeRate>('baseCurrency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Get unique currencies for filter dropdowns
  const uniqueBaseCurrencies = [...new Set(rates.map(rate => rate.baseCurrency))];
  const uniqueTargetCurrencies = [...new Set(rates.map(rate => rate.targetCurrency))];
  
  // Load rates on component mount
  useEffect(() => {
    loadAllRates();
  }, [loadAllRates]);
  
  // Update filtered rates when rates or filters change
  useEffect(() => {
    let result = [...rates];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(rate => 
        rate.baseCurrency.toLowerCase().includes(query) ||
        rate.targetCurrency.toLowerCase().includes(query)
      );
    }
    
    // Apply base currency filter
    if (baseCurrencyFilter) {
      result = result.filter(rate => rate.baseCurrency === baseCurrencyFilter);
    }
    
    // Apply target currency filter
    if (targetCurrencyFilter) {
      result = result.filter(rate => rate.targetCurrency === targetCurrencyFilter);
    }
    
    // Apply source filter
    if (sourceFilter) {
      result = result.filter(rate => rate.source === sourceFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });
    
    setFilteredRates(result);
  }, [rates, searchQuery, baseCurrencyFilter, targetCurrencyFilter, sourceFilter, sortField, sortDirection]);
  
  // Handle sort click
  const handleSort = (field: keyof ExchangeRate) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle refresh click
  const handleRefresh = () => {
    loadAllRates();
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setBaseCurrencyFilter('');
    setTargetCurrencyFilter('');
    setSourceFilter('');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };
  
  // Get source badge color
  const getSourceBadgeColor = (source: ExchangeRateSource) => {
    switch (source) {
      case ExchangeRateSource.API:
        return 'bg-blue-100 text-blue-800';
      case ExchangeRateSource.MANUAL:
        return 'bg-amber-100 text-amber-800';
      case ExchangeRateSource.PARTNER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="card-ios">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Exchange Rates</CardTitle>
            <CardDescription>
              Manage currency exchange rates and margins
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            
            <Button variant="default" size="sm" onClick={onCreateRate}>
              <Plus className="mr-2 h-4 w-4" />
              New Rate
            </Button>
          </div>
        </div>
        
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {formatDate(lastUpdated)}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="mb-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search currencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={baseCurrencyFilter} onValueChange={setBaseCurrencyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Base Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Base Currencies</SelectItem>
                {uniqueBaseCurrencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={targetCurrencyFilter} onValueChange={setTargetCurrencyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Target Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Target Currencies</SelectItem>
                {uniqueTargetCurrencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sources</SelectItem>
                <SelectItem value={ExchangeRateSource.API}>API</SelectItem>
                <SelectItem value={ExchangeRateSource.MANUAL}>Manual</SelectItem>
                <SelectItem value={ExchangeRateSource.PARTNER}>Partner</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" onClick={handleResetFilters}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('baseCurrency')}
                >
                  Base Currency
                  {sortField === 'baseCurrency' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('targetCurrency')}
                >
                  Target Currency
                  {sortField === 'targetCurrency' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('rate')}
                >
                  Rate
                  {sortField === 'rate' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('marginPercentage')}
                >
                  Margin (%)
                  {sortField === 'marginPercentage' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead>Source</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('lastUpdated')}
                >
                  Last Updated
                  {sortField === 'lastUpdated' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading exchange rates...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No exchange rates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell className="font-medium">{rate.baseCurrency}</TableCell>
                    <TableCell>{rate.targetCurrency}</TableCell>
                    <TableCell className="text-right">{rate.rate.toFixed(4)}</TableCell>
                    <TableCell className="text-right">{rate.marginPercentage.toFixed(2)}%</TableCell>
                    <TableCell>
                      <Badge className={getSourceBadgeColor(rate.source)}>
                        {rate.source}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(rate.lastUpdated)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEditRate(rate)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
