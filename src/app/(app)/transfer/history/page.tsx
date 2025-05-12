'use client';

/**
 * Transfer History Page
 * Displays a list of past money transfers with filtering options
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Filter, ArrowUpDown, Eye, Download, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { transferMockService } from '@/services/mock/transfer-mock-service';
import { Skeleton } from '@/components/ui/skeleton';
import { generateAndDownloadReceipt, ReceiptData } from '@/lib/receipt-generator';
import { toast } from 'sonner';

// Types
interface TransferHistory {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  sendAmount: number;
  receiveAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  date: string;
  trackingNumber: string;
  purpose: string;
  paymentMethod: string;
  deliveryMethod: string;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

/**
 * Transfer History Page Component
 */
export default function TransferHistoryPage() {
  const router = useRouter();
  const [transfers, setTransfers] = useState<TransferHistory[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<TransferHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 10;
  
  // Fetch transfer history
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        setIsLoading(true);
        const data = await transferMockService.getTransferHistory();
        setTransfers(data);
        setFilteredTransfers(data);
      } catch (error) {
        console.error('Error fetching transfers:', error);
        toast.error('Failed to load transfer history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransfers();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...transfers];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(transfer => transfer.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(transfer => 
        transfer.trackingNumber.toLowerCase().includes(query) ||
        transfer.senderName.toLowerCase().includes(query) ||
        transfer.receiverName.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.sendAmount - b.sendAmount;
          break;
        case 'sender':
          comparison = a.senderName.localeCompare(b.senderName);
          break;
        case 'receiver':
          comparison = a.receiverName.localeCompare(b.receiverName);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredTransfers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transfers, searchQuery, statusFilter, sortField, sortDirection]);
  
  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle view transfer details
  const handleViewTransfer = (id: string) => {
    router.push(`/transfer/details/${id}`);
  };
  
  // Handle download receipt
  const handleDownloadReceipt = async (transfer: TransferHistory) => {
    try {
      const receiptData: ReceiptData = {
        transactionId: transfer.id,
        trackingNumber: transfer.trackingNumber,
        date: transfer.date,
        sender: {
          name: transfer.senderName,
          id: transfer.senderId
        },
        receiver: {
          name: transfer.receiverName,
          id: transfer.receiverId
        },
        amount: {
          sendAmount: transfer.sendAmount,
          receiveAmount: transfer.receiveAmount,
          sendCurrency: transfer.sendCurrency,
          receiveCurrency: transfer.receiveCurrency,
          exchangeRate: transfer.receiveAmount / transfer.sendAmount,
          fee: transfer.sendAmount * 0.03, // Assuming 3% fee
          totalCost: transfer.sendAmount * 1.03 // Total with fee
        },
        details: {
          purpose: transfer.purpose,
          sourceOfFunds: 'Not Available', // Not available in history data
          paymentMethod: transfer.paymentMethod,
          deliveryMethod: transfer.deliveryMethod
        },
        status: transfer.status as 'completed' | 'pending' | 'failed' | 'cancelled'
      };
      
      generateAndDownloadReceipt(receiptData);
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to generate receipt');
    }
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransfers = filteredTransfers.slice(startIndex, startIndex + itemsPerPage);
  
  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
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
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>
            View and manage your money transfer history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking number, sender or receiver..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => router.push('/transfer')}>
                  New Transfer
                </Button>
              </div>
            </div>
            
            {/* Transactions Table */}
            {filteredTransfers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transfers found matching your criteria</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto font-medium"
                          onClick={() => handleSort('date')}
                        >
                          Date
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto font-medium"
                          onClick={() => handleSort('sender')}
                        >
                          Sender
                          <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto font-medium"
                          onClick={() => handleSort('receiver')}
                        >
                          Receiver
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
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">
                          {formatDate(transfer.date)}
                        </TableCell>
                        <TableCell>{transfer.trackingNumber}</TableCell>
                        <TableCell>{transfer.senderName}</TableCell>
                        <TableCell>{transfer.receiverName}</TableCell>
                        <TableCell>
                          {formatCurrency(transfer.sendAmount, transfer.sendCurrency)}
                          <span className="text-muted-foreground text-xs block">
                            → {formatCurrency(transfer.receiveAmount, transfer.receiveCurrency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={transfer.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewTransfer(transfer.id)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {transfer.status === 'completed' && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownloadReceipt(transfer)}
                                title="Download Receipt"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
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
    </div>
  );
}
