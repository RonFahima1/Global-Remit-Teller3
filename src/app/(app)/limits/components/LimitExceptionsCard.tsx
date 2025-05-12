'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Clock, AlertCircle, Search, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';

interface LimitExceptionsCardProps {
  clientId?: string;
  isAdmin?: boolean;
}

type ExceptionStatus = 'pending' | 'approved' | 'rejected' | 'expired';

interface LimitException {
  id: string;
  clientName: string;
  clientId: string;
  limitType: string;
  requestedAmount: number;
  currency: string;
  reason: string;
  status: ExceptionStatus;
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  expiresAt: string;
  notes?: string;
}

export function LimitExceptionsCard({ clientId, isAdmin = false }: LimitExceptionsCardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExceptionStatus | 'all'>('all');
  const [selectedException, setSelectedException] = useState<LimitException | null>(null);
  const [showExceptionDialog, setShowExceptionDialog] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  
  // Mock limit exceptions data
  const mockExceptions: LimitException[] = [
    {
      id: 'LE-001',
      clientName: 'John Smith',
      clientId: 'C-001',
      limitType: 'Daily Limit',
      requestedAmount: 7500,
      currency: 'USD',
      reason: 'Client needs to send emergency funds to family abroad',
      status: 'pending',
      requestedBy: 'Sarah Johnson',
      requestedAt: '2025-05-11T10:30:00',
      expiresAt: '2025-05-12T10:30:00',
    },
    {
      id: 'LE-002',
      clientName: 'ABC Corporation',
      clientId: 'C-002',
      limitType: 'Per Transaction',
      requestedAmount: 12000,
      currency: 'EUR',
      reason: 'Business payment to international supplier',
      status: 'approved',
      requestedBy: 'Michael Chen',
      requestedAt: '2025-05-10T14:15:00',
      reviewedBy: 'David Wilson',
      reviewedAt: '2025-05-10T16:20:00',
      expiresAt: '2025-05-17T14:15:00',
      notes: 'Approved after verification with business owner',
    },
    {
      id: 'LE-003',
      clientName: 'Elena Rodriguez',
      clientId: 'C-003',
      limitType: 'Weekly Limit',
      requestedAmount: 15000,
      currency: 'USD',
      reason: 'Property purchase deposit',
      status: 'rejected',
      requestedBy: 'James Brown',
      requestedAt: '2025-05-09T09:45:00',
      reviewedBy: 'David Wilson',
      reviewedAt: '2025-05-09T11:30:00',
      expiresAt: '2025-05-16T09:45:00',
      notes: 'Insufficient documentation provided',
    },
    {
      id: 'LE-004',
      clientName: 'Global Traders Ltd',
      clientId: 'C-004',
      limitType: 'Monthly Limit',
      requestedAmount: 75000,
      currency: 'GBP',
      reason: 'Increased trading volume for Q2',
      status: 'expired',
      requestedBy: 'Sarah Johnson',
      requestedAt: '2025-04-25T13:20:00',
      expiresAt: '2025-05-02T13:20:00',
    },
  ];
  
  // Filter exceptions based on search query, status filter, and client ID
  const filteredExceptions = mockExceptions.filter(exception => {
    const matchesSearch = 
      exception.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exception.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exception.status === statusFilter;
    
    const matchesClient = !clientId || exception.clientId === clientId;
    
    return matchesSearch && matchesStatus && matchesClient;
  });
  
  const handleViewException = (exception: LimitException) => {
    setSelectedException(exception);
    setShowExceptionDialog(true);
  };
  
  const handleApproveException = () => {
    // In a real app, this would be an API call to approve the exception
    console.log('Approving exception:', selectedException?.id, 'with note:', approvalNote);
    setShowExceptionDialog(false);
    setApprovalNote('');
  };
  
  const handleRejectException = () => {
    // In a real app, this would be an API call to reject the exception
    console.log('Rejecting exception:', selectedException?.id, 'with note:', approvalNote);
    setShowExceptionDialog(false);
    setApprovalNote('');
  };
  
  const getStatusBadge = (status: ExceptionStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Expired</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status: ExceptionStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3 text-card-foreground">Limit Exceptions</CardTitle>
        <CardDescription className="text-muted-foreground">
          {clientId 
            ? 'Limit exception requests for this client' 
            : 'All limit exception requests'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ExceptionStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Exceptions table */}
        {filteredExceptions.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Limit Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExceptions.map((exception) => (
                  <TableRow key={exception.id}>
                    <TableCell className="font-medium">{exception.id}</TableCell>
                    <TableCell>{exception.clientName}</TableCell>
                    <TableCell>{exception.limitType}</TableCell>
                    <TableCell>{formatCurrency(exception.requestedAmount, exception.currency)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(exception.status)}
                        {getStatusBadge(exception.status)}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(exception.requestedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewException(exception)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No exceptions found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'There are no limit exceptions to display'}
            </p>
          </div>
        )}
      </CardContent>
      
      {/* Exception detail dialog */}
      <Dialog open={showExceptionDialog} onOpenChange={setShowExceptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Limit Exception Details</DialogTitle>
            <DialogDescription>
              Review the details of this limit exception request
            </DialogDescription>
          </DialogHeader>
          
          {selectedException && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Exception ID</p>
                  <p className="font-medium">{selectedException.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getStatusIcon(selectedException.status)}
                    {getStatusBadge(selectedException.status)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Client</p>
                <p className="font-medium">{selectedException.clientName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Limit Type</p>
                  <p className="font-medium">{selectedException.limitType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requested Amount</p>
                  <p className="font-medium">{formatCurrency(selectedException.requestedAmount, selectedException.currency)}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Reason for Request</p>
                <p>{selectedException.reason}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Requested By</p>
                  <p>{selectedException.requestedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requested At</p>
                  <p>{formatDate(selectedException.requestedAt)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Expires At</p>
                  <p>{formatDate(selectedException.expiresAt)}</p>
                </div>
                {selectedException.reviewedBy && (
                  <div>
                    <p className="text-muted-foreground">Reviewed By</p>
                    <p>{selectedException.reviewedBy}</p>
                  </div>
                )}
              </div>
              
              {selectedException.notes && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Notes</p>
                  <p>{selectedException.notes}</p>
                </div>
              )}
              
              {isAdmin && selectedException.status === 'pending' && (
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="approval-note">Add a note</Label>
                  <Textarea
                    id="approval-note"
                    placeholder="Enter any notes about this decision..."
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setShowExceptionDialog(false)}>
              Close
            </Button>
            
            {isAdmin && selectedException?.status === 'pending' && (
              <div className="flex space-x-2">
                <Button variant="destructive" onClick={handleRejectException}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="default" onClick={handleApproveException}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
