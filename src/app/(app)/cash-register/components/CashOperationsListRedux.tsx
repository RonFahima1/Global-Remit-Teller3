/**
 * Cash Operations List Component (Redux Version)
 * Displays a list of cash operations using Redux state
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Calculator, 
  ChevronDown, 
  ChevronUp,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useCashRegister } from '@/lib/redux/hooks';
import { CashOperationType } from '@/lib/redux/slices/cash-register-slice';
import { formatDate, formatCurrency } from '@/lib/utils';

/**
 * Cash Operations List Component
 */
export function CashOperationsListRedux() {
  const { recentOperations } = useCashRegister();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCurrency, setFilterCurrency] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filter operations based on search term and filters
  const filteredOperations = recentOperations.filter(operation => {
    const matchesSearch = 
      operation.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || operation.type === filterType;
    const matchesCurrency = filterCurrency === 'all' || operation.currency === filterCurrency;
    
    return matchesSearch && matchesType && matchesCurrency;
  });
  
  // Sort operations
  const sortedOperations = [...filteredOperations].sort((a, b) => {
    if (sortField === 'timestamp') {
      return sortDirection === 'asc'
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    
    if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    
    return 0;
  });
  
  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Get operation type badge
  const getOperationTypeBadge = (type: string) => {
    switch (type) {
      case CashOperationType.DEPOSIT:
        return <Badge className="bg-green-500"><ArrowDownCircle className="mr-1 h-3 w-3" /> Deposit</Badge>;
      case CashOperationType.WITHDRAWAL:
        return <Badge className="bg-red-500"><ArrowUpCircle className="mr-1 h-3 w-3" /> Withdrawal</Badge>;
      case CashOperationType.ADJUSTMENT:
        return <Badge className="bg-blue-500"><Calculator className="mr-1 h-3 w-3" /> Adjustment</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  // Export operations to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Currency', 'Timestamp', 'User', 'Notes', 'Reference'];
    
    const csvContent = [
      headers.join(','),
      ...filteredOperations.map(op => [
        op.id,
        op.type,
        op.amount,
        op.currency,
        op.timestamp,
        op.userId,
        `"${op.notes?.replace(/"/g, '""') || ''}"`,
        op.reference
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cash-operations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cash Operations</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportToCSV}
          disabled={filteredOperations.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search operations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={CashOperationType.DEPOSIT}>Deposits</SelectItem>
                  <SelectItem value={CashOperationType.WITHDRAWAL}>Withdrawals</SelectItem>
                  <SelectItem value={CashOperationType.ADJUSTMENT}>Adjustments</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterCurrency} onValueChange={setFilterCurrency}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="ILS">ILS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredOperations.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No operations found
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                      {sortField === 'amount' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 inline h-4 w-4" /> : 
                          <ChevronDown className="ml-1 inline h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('timestamp')}
                    >
                      Date/Time
                      {sortField === 'timestamp' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 inline h-4 w-4" /> : 
                          <ChevronDown className="ml-1 inline h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOperations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell>{getOperationTypeBadge(operation.type)}</TableCell>
                      <TableCell className={`font-medium ${
                        operation.type === CashOperationType.DEPOSIT 
                          ? 'text-green-600' 
                          : operation.type === CashOperationType.WITHDRAWAL 
                            ? 'text-red-600' 
                            : ''
                      }`}>
                        {formatCurrency(operation.amount, operation.currency)}
                      </TableCell>
                      <TableCell>{formatDate(operation.timestamp)}</TableCell>
                      <TableCell>{operation.userId}</TableCell>
                      <TableCell>{operation.reference}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={operation.notes}>
                        {operation.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
