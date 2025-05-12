'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditLogFiltersProps {
  selectedFilters: {
    action: string;
    module: string;
    user: string;
  };
  onFilterChange: (filters: { action: string; module: string; user: string }) => void;
}

export function AuditLogFilters({ selectedFilters, onFilterChange }: AuditLogFiltersProps) {
  // Mock data for filters
  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'APPROVE', label: 'Approve' },
    { value: 'REJECT', label: 'Reject' },
    { value: 'PROCESS', label: 'Process' },
    { value: 'FAILED', label: 'Failed' },
  ];
  
  const modules = [
    { value: 'all', label: 'All Modules' },
    { value: 'CLIENT', label: 'Client' },
    { value: 'TRANSACTION', label: 'Transaction' },
    { value: 'KYC', label: 'KYC' },
    { value: 'LIMIT_EXCEPTION', label: 'Limit Exception' },
    { value: 'SYSTEM', label: 'System' },
    { value: 'AUTH', label: 'Authentication' },
    { value: 'USER', label: 'User' },
  ];
  
  const users = [
    { value: 'all', label: 'All Users' },
    { value: 'U-001', label: 'Sarah Johnson (Teller)' },
    { value: 'U-002', label: 'Michael Chen (Manager)' },
    { value: 'U-003', label: 'David Wilson (Admin)' },
    { value: 'U-004', label: 'James Brown (Teller)' },
  ];
  
  const handleFilterChange = (field: string, value: string) => {
    onFilterChange({
      ...selectedFilters,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20">
      <div className="space-y-2">
        <Label htmlFor="action-filter">Action Type</Label>
        <Select
          value={selectedFilters.action}
          onValueChange={(value) => handleFilterChange('action', value)}
        >
          <SelectTrigger id="action-filter">
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            {actionTypes.map((action) => (
              <SelectItem key={action.value} value={action.value}>
                {action.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="module-filter">Module</Label>
        <Select
          value={selectedFilters.module}
          onValueChange={(value) => handleFilterChange('module', value)}
        >
          <SelectTrigger id="module-filter">
            <SelectValue placeholder="Select module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem key={module.value} value={module.value}>
                {module.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user-filter">User</Label>
        <Select
          value={selectedFilters.user}
          onValueChange={(value) => handleFilterChange('user', value)}
        >
          <SelectTrigger id="user-filter">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.value} value={user.value}>
                {user.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
