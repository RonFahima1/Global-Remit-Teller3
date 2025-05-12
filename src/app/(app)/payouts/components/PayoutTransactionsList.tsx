/**
 * Payout Transactions List Component
 * Displays a list of payout transactions with filtering and sorting
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
  Eye,
  Filter,
  Calendar,
  FileText
} from 'lucide-react';
import { usePayouts } from '@/hooks/usePayouts';
import { Payout, PayoutMethod, PayoutStatus } from '@/types/payout';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

/**
 * Payout Transactions List Props
 */
interface PayoutTransactionsListProps {
  onViewPayout: (payout: Payout) => void;
}

/**
 * Payout Transactions List Component
 */
export function PayoutTransactionsList({ onViewPayout }: PayoutTransactionsListProps) {
  const { 
    payouts, 
    isLoading, 
    error, 
    loadAllPayouts,
    loadPayoutsByFilter
  } = usePayouts();
  
  // State for filtering and sorting
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('');
  const [partnerFilter, setPartnerFilter] = useState<string>('');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Payout>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Get unique values for filter dropdowns
  const uniquePartners = [...new Set(payouts.map(payout => payout.partnerName))];
  
  // Load payouts on component mount
  useEffect(() => {
    loadAllPayouts();
  }, [loadAllPayouts]);
  
  // Update filtered payouts when payouts or filters change
  useEffect(() => {
    let result = [...payouts];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(payout => 
        payout.transactionId.toLowerCase().includes(query) ||
        payout.senderName.toLowerCase().includes(query) ||
        payout.receiverName.toLowerCase().includes(query) ||
        (payout.partnerReference && payout.partnerReference.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(payout => payout.status === statusFilter);
    }
    
    // Apply method filter
    if (methodFilter) {
      result = result.filter(payout => payout.method === methodFilter);
    }
    
    // Apply partner filter
    if (partnerFilter) {
      result = result.filter(payout => payout.partnerName === partnerFilter);
    }
    
    // Apply date range filter
    if (dateRangeFilter) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRangeFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'yesterday':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endOfYesterday = new Date(startDate);
          endOfYesterday.setHours(23, 59, 59, 999);
          result = result.filter(payout => {
            const payoutDate = new Date(payout.createdAt);
            return payoutDate >= startDate && payoutDate <= endOfYesterday;
          });
          break;
        case 'last7days':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          result = result.filter(payout => new Date(payout.createdAt) >= startDate);
          break;
        case 'last30days':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 30);
          result = result.filter(payout => new Date(payout.createdAt) >= startDate);
          break;
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          result = result.filter(payout => new Date(payout.createdAt) >= startDate);
          break;
        case 'lastMonth':
          const lastMonth = now.getMonth() - 1;
          const year = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
          const month = lastMonth < 0 ? 11 : lastMonth;
          startDate = new Date(year, month, 1);
          const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
          result = result.filter(payout => {
            const payoutDate = new Date(payout.createdAt);
            return payoutDate >= startDate && payoutDate <= endDate;
          });
          break;
      }
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
    
    setFilteredPayouts(result);
  }, [payouts, searchQuery, statusFilter, methodFilter, partnerFilter, dateRangeFilter, sortField, sortDirection]);
  
  // Handle sort click
  const handleSort = (field: keyof Payout) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Handle refresh click
  const handleRefresh = () => {
    loadAllPayouts();
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setMethodFilter('');
    setPartnerFilter('');
    setDateRangeFilter('');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PayoutStatus.PENDING:
        return 'bg-blue-100 text-blue-800';
      case PayoutStatus.PROCESSING:
        return 'bg-amber-100 text-amber-800';
      case PayoutStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case PayoutStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="card-ios">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Payout Transactions</CardTitle>
            <CardDescription>
              View and manage payout transactions
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="mb-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID, sender, or receiver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value={PayoutStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={PayoutStatus.PROCESSING}>Processing</SelectItem>
                <SelectItem value={PayoutStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={PayoutStatus.FAILED}>Failed</SelectItem>
                <SelectItem value={PayoutStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Methods</SelectItem>
                <SelectItem value={PayoutMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
                <SelectItem value={PayoutMethod.CASH_PICKUP}>Cash Pickup</SelectItem>
                <SelectItem value={PayoutMethod.MOBILE_WALLET}>Mobile Wallet</SelectItem>
                <SelectItem value={PayoutMethod.HOME_DELIVERY}>Home Delivery</SelectItem>
                <SelectItem value={PayoutMethod.DEBIT_CARD}>Debit Card</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={partnerFilter} onValueChange={setPartnerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Partners</SelectItem>
                {uniquePartners.map(partner => (
                  <SelectItem key={partner} value={partner}>{partner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
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
                  onClick={() => handleSort('transactionId')}
                >
                  Transaction ID
                  {sortField === 'transactionId' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('partnerName')}
                >
                  Partner
                  {sortField === 'partnerName' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('senderName')}
                >
                  Sender
                  {sortField === 'senderName' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('receiverName')}
                >
                  Receiver
                  {sortField === 'receiverName' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  {sortField === 'amount' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Date
                  {sortField === 'createdAt' && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading payouts...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPayouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p>No payout transactions found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your filters or search criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.transactionId}</TableCell>
                    <TableCell>{payout.partnerName}</TableCell>
                    <TableCell>{payout.senderName}</TableCell>
                    <TableCell>{payout.receiverName}</TableCell>
                    <TableCell className="text-right">
                      {payout.amount.toLocaleString()} {payout.currency}
                    </TableCell>
                    <TableCell>
                      {payout.method === PayoutMethod.BANK_TRANSFER && 'Bank Transfer'}
                      {payout.method === PayoutMethod.CASH_PICKUP && 'Cash Pickup'}
                      {payout.method === PayoutMethod.MOBILE_WALLET && 'Mobile Wallet'}
                      {payout.method === PayoutMethod.HOME_DELIVERY && 'Home Delivery'}
                      {payout.method === PayoutMethod.DEBIT_CARD && 'Debit Card'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(payout.status)}>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(payout.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onViewPayout(payout)}>
                        <Eye className="h-4 w-4" />
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
