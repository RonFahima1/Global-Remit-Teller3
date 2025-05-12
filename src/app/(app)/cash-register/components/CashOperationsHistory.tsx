/**
 * Cash Operations History Component
 * Displays a history of cash register operations with filtering and sorting
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowUpDown, Calendar, Download } from 'lucide-react';
import { 
  CashOperation, 
  CashOperationType 
} from '@/lib/redux/slices/cash-register-slice';
import { cashRegisterService } from '@/services/cash-register-service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useCashRegister } from '@/lib/redux/hooks';
import { format } from 'date-fns';

// Operation type badge component
const OperationTypeBadge = ({ type }: { type: CashOperationType }) => {
  const typeStyles = {
    [CashOperationType.OPEN]: 'bg-blue-100 text-blue-800',
    [CashOperationType.CLOSE]: 'bg-purple-100 text-purple-800',
    [CashOperationType.DEPOSIT]: 'bg-green-100 text-green-800',
    [CashOperationType.WITHDRAWAL]: 'bg-red-100 text-red-800',
    [CashOperationType.ADJUSTMENT]: 'bg-yellow-100 text-yellow-800'
  };
  
  const typeLabels = {
    [CashOperationType.OPEN]: 'Open',
    [CashOperationType.CLOSE]: 'Close',
    [CashOperationType.DEPOSIT]: 'Deposit',
    [CashOperationType.WITHDRAWAL]: 'Withdrawal',
    [CashOperationType.ADJUSTMENT]: 'Adjustment'
  };
  
  return (
    <Badge className={typeStyles[type]}>
      {typeLabels[type]}
    </Badge>
  );
};

/**
 * Cash Operations History Component
 */
export function CashOperationsHistory() {
  const { recentOperations, isLoading } = useCashRegister();
  const [operations, setOperations] = useState<CashOperation[]>([]);
  const [filteredOperations, setFilteredOperations] = useState<CashOperation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 10;
  
  // Initialize operations from Redux state
  useEffect(() => {
    setOperations(recentOperations);
    setFilteredOperations(recentOperations);
  }, [recentOperations]);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...operations];
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(operation => operation.type === typeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(operation => 
        operation.id.toLowerCase().includes(query) ||
        operation.currency.toLowerCase().includes(query) ||
        (operation.notes?.toLowerCase().includes(query) || false) ||
        (operation.reference?.toLowerCase().includes(query) || false)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'currency':
          comparison = a.currency.localeCompare(b.currency);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredOperations(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [operations, searchQuery, typeFilter, sortField, sortDirection]);
  
  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Format amount with currency
  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'MULTI') {
      return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    return amount.toLocaleString(undefined, { 
      style: 'currency', 
      currency, 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredOperations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOperations = filteredOperations.slice(startIndex, startIndex + itemsPerPage);
  
  // Render loading skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Operations History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, currency, notes, or reference..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={CashOperationType.OPEN}>Open</SelectItem>
                  <SelectItem value={CashOperationType.CLOSE}>Close</SelectItem>
                  <SelectItem value={CashOperationType.DEPOSIT}>Deposit</SelectItem>
                  <SelectItem value={CashOperationType.WITHDRAWAL}>Withdrawal</SelectItem>
                  <SelectItem value={CashOperationType.ADJUSTMENT}>Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Operations Table */}
          {filteredOperations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No operations found matching your criteria</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto font-medium"
                        onClick={() => handleSort('timestamp')}
                      >
                        Date & Time
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto font-medium"
                        onClick={() => handleSort('type')}
                      >
                        Type
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto font-medium"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto font-medium"
                        onClick={() => handleSort('currency')}
                      >
                        Currency
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOperations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell className="font-medium">
                        {format(new Date(operation.timestamp), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <OperationTypeBadge type={operation.type} />
                      </TableCell>
                      <TableCell>
                        {formatAmount(operation.amount, operation.currency)}
                      </TableCell>
                      <TableCell>{operation.currency}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {operation.notes || '-'}
                      </TableCell>
                      <TableCell>{operation.reference || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
