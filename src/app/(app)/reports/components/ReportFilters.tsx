'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search, Filter, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ReportFilter {
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  type: string;
  clientId: string;
  clientName: string;
  status: string;
  currency: string;
  minAmount: string;
  maxAmount: string;
  tellerName: string;
}

interface ReportFiltersProps {
  filters: ReportFilter;
  onFilterChange: (filters: ReportFilter) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export function ReportFilters({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
}: ReportFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const handleFilterChange = (key: keyof ReportFilter, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };
  
  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'remittance', label: 'Remittance' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'exchange', label: 'Currency Exchange' },
  ];
  
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];
  
  const currencies = [
    { value: 'all', label: 'All Currencies' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'ILS', label: 'ILS' },
    { value: 'JPY', label: 'JPY' },
  ];
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.type !== 'all') count++;
    if (filters.clientName) count++;
    if (filters.status !== 'all') count++;
    if (filters.currency !== 'all') count++;
    if (filters.minAmount) count++;
    if (filters.maxAmount) count++;
    if (filters.tellerName) count++;
    return count;
  };
  
  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className="card-ios">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="space-y-1">
              <Label htmlFor="date-from">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-from"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => handleFilterChange('dateFrom', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="date-to">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-to"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? (
                      format(filters.dateTo, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => handleFilterChange('dateTo', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Transaction Type */}
          <div className="space-y-1">
            <Label htmlFor="type">Transaction Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Client Search */}
          <div className="space-y-1 flex-1">
            <Label htmlFor="client-search">Client</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="client-search"
                placeholder="Search by client name"
                value={filters.clientName}
                onChange={(e) => handleFilterChange('clientName', e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="flex items-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-1.5"
            >
              <Filter className="h-4 w-4" />
              Advanced
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            
            <Button onClick={onApplyFilters}>Apply Filters</Button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {/* Status */}
            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Currency */}
            <div className="space-y-1">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={filters.currency}
                onValueChange={(value) => handleFilterChange('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Amount Range */}
            <div className="space-y-1">
              <Label>Amount Range</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                />
              </div>
            </div>
            
            {/* Teller */}
            <div className="space-y-1">
              <Label htmlFor="teller">Teller</Label>
              <Input
                id="teller"
                placeholder="Search by teller name"
                value={filters.tellerName}
                onChange={(e) => handleFilterChange('tellerName', e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="ghost" 
                onClick={onResetFilters}
                className="flex items-center gap-1.5"
              >
                <X className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
