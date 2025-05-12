'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  User,
  DollarSign,
  Shield,
  Clock,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { format } from 'date-fns';

// Types
interface AuditLogTableProps {
  searchQuery: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  filters: {
    action: string;
    module: string;
    user: string;
  };
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  action: string;
  module: string;
  details: string;
  status: 'success' | 'warning' | 'error';
  ipAddress: string;
  metadata?: Record<string, any>;
}

export function AuditLogTable({ searchQuery, dateRange, filters }: AuditLogTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDetails, setShowLogDetails] = useState(false);
  
  // Mock audit log data
  const mockAuditLogs: AuditLog[] = [
    {
      id: 'AL-001',
      timestamp: '2025-05-11T10:30:00',
      user: {
        id: 'U-001',
        name: 'Sarah Johnson',
        role: 'Teller'
      },
      action: 'CREATE',
      module: 'CLIENT',
      details: 'Created new client: John Smith',
      status: 'success',
      ipAddress: '192.168.1.101'
    },
    {
      id: 'AL-002',
      timestamp: '2025-05-11T11:15:00',
      user: {
        id: 'U-002',
        name: 'Michael Chen',
        role: 'Manager'
      },
      action: 'APPROVE',
      module: 'KYC',
      details: 'Approved KYC verification for client: Elena Rodriguez',
      status: 'success',
      ipAddress: '192.168.1.102'
    },
    {
      id: 'AL-003',
      timestamp: '2025-05-11T12:45:00',
      user: {
        id: 'U-001',
        name: 'Sarah Johnson',
        role: 'Teller'
      },
      action: 'PROCESS',
      module: 'TRANSACTION',
      details: 'Processed withdrawal of $1,500 for client: John Smith',
      status: 'success',
      ipAddress: '192.168.1.101',
      metadata: {
        transactionId: 'TX-001',
        amount: 1500,
        currency: 'USD',
        clientId: 'C-001'
      }
    },
    {
      id: 'AL-004',
      timestamp: '2025-05-11T14:20:00',
      user: {
        id: 'U-003',
        name: 'David Wilson',
        role: 'Admin'
      },
      action: 'UPDATE',
      module: 'SYSTEM',
      details: 'Updated exchange rate: USD to EUR',
      status: 'success',
      ipAddress: '192.168.1.103'
    },
    {
      id: 'AL-005',
      timestamp: '2025-05-11T15:10:00',
      user: {
        id: 'U-002',
        name: 'Michael Chen',
        role: 'Manager'
      },
      action: 'REJECT',
      module: 'LIMIT_EXCEPTION',
      details: 'Rejected limit exception request for client: Global Traders Ltd',
      status: 'warning',
      ipAddress: '192.168.1.102'
    },
    {
      id: 'AL-006',
      timestamp: '2025-05-11T16:30:00',
      user: {
        id: 'U-001',
        name: 'Sarah Johnson',
        role: 'Teller'
      },
      action: 'LOGIN',
      module: 'AUTH',
      details: 'User login',
      status: 'success',
      ipAddress: '192.168.1.101'
    },
    {
      id: 'AL-007',
      timestamp: '2025-05-11T17:45:00',
      user: {
        id: 'U-004',
        name: 'James Brown',
        role: 'Teller'
      },
      action: 'FAILED',
      module: 'TRANSACTION',
      details: 'Failed to process deposit - Exceeded daily limit',
      status: 'error',
      ipAddress: '192.168.1.104',
      metadata: {
        attemptedAmount: 12000,
        currency: 'USD',
        clientId: 'C-005',
        reason: 'LIMIT_EXCEEDED'
      }
    },
    {
      id: 'AL-008',
      timestamp: '2025-05-11T18:15:00',
      user: {
        id: 'U-003',
        name: 'David Wilson',
        role: 'Admin'
      },
      action: 'UPDATE',
      module: 'USER',
      details: 'Updated user role: Michael Chen from Teller to Manager',
      status: 'success',
      ipAddress: '192.168.1.103'
    },
    {
      id: 'AL-009',
      timestamp: '2025-05-11T19:00:00',
      user: {
        id: 'U-002',
        name: 'Michael Chen',
        role: 'Manager'
      },
      action: 'APPROVE',
      module: 'LIMIT_EXCEPTION',
      details: 'Approved limit exception for client: ABC Corporation',
      status: 'success',
      ipAddress: '192.168.1.102'
    },
    {
      id: 'AL-010',
      timestamp: '2025-05-11T20:30:00',
      user: {
        id: 'U-001',
        name: 'Sarah Johnson',
        role: 'Teller'
      },
      action: 'LOGOUT',
      module: 'AUTH',
      details: 'User logout',
      status: 'success',
      ipAddress: '192.168.1.101'
    }
  ];
  
  // Filter logs based on search query, date range, and filters
  const filteredLogs = mockAuditLogs.filter(log => {
    // Search query filter
    const matchesSearch = 
      searchQuery === '' ||
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filter
    const logDate = new Date(log.timestamp);
    const matchesDateRange = 
      (!dateRange.from || logDate >= dateRange.from) &&
      (!dateRange.to || logDate <= dateRange.to);
    
    // Other filters
    const matchesAction = filters.action === 'all' || log.action === filters.action;
    const matchesModule = filters.module === 'all' || log.module === filters.module;
    const matchesUser = filters.user === 'all' || log.user.id === filters.user;
    
    return matchesSearch && matchesDateRange && matchesAction && matchesModule && matchesUser;
  });
  
  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowLogDetails(true);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  // Get icon for module
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'CLIENT':
        return <User className="h-4 w-4" />;
      case 'TRANSACTION':
        return <DollarSign className="h-4 w-4" />;
      case 'KYC':
        return <Shield className="h-4 w-4" />;
      case 'LIMIT_EXCEPTION':
        return <AlertCircle className="h-4 w-4" />;
      case 'SYSTEM':
        return <FileText className="h-4 w-4" />;
      case 'AUTH':
        return <User className="h-4 w-4" />;
      case 'USER':
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="card-ios">
        <CardContent className="p-0">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 inline-block mr-1" />
                            {format(new Date(log.timestamp), 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs">
                            <Clock className="h-3 w-3 inline-block mr-1" />
                            {format(new Date(log.timestamp), 'h:mm a')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.user.name}</span>
                          <span className="text-xs text-muted-foreground">{log.user.role}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        {log.action}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getModuleIcon(log.module)}
                          <span>{log.module}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {log.details}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                        <span className="text-muted-foreground">No audit logs found</span>
                        <span className="text-xs text-muted-foreground">Try adjusting your filters</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        {filteredLogs.length > 0 && (
          <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="mx-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      
      {/* Log Details Dialog */}
      <Dialog open={showLogDetails} onOpenChange={setShowLogDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this audit log entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Log ID</p>
                  <p className="font-medium">{selectedLog.id}</p>
                </div>
                <div>
                  {getStatusBadge(selectedLog.status)}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Timestamp</p>
                <p className="font-medium">{formatDate(selectedLog.timestamp)}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-medium">{selectedLog.user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedLog.user.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Action</p>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Module</p>
                  <p className="font-medium">{selectedLog.module}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Details</p>
                <p>{selectedLog.details}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IP Address</p>
                <p className="font-medium">{selectedLog.ipAddress}</p>
              </div>
              
              {selectedLog.metadata && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Additional Information</p>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
