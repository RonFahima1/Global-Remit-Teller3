'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Filter, Download, Calendar, Clock, User, FileText } from 'lucide-react';
import { AuditLogTable } from './components/AuditLogTable';
import { DateRangePicker } from './components/DateRangePicker';
import { AuditLogFilters } from './components/AuditLogFilters';

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    action: 'all',
    module: 'all',
    user: 'all',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search API call
    console.log('Searching for:', searchQuery);
  };
  
  const handleExport = () => {
    // In a real app, this would trigger an export API call
    console.log('Exporting audit logs with filters:', {
      searchQuery,
      dateRange,
      selectedFilters,
    });
  };
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-h1 font-h1 text-foreground">Audit Logs</h1>
        </div>
        
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>
      
      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Search & Filter</CardTitle>
          <CardDescription className="text-muted-foreground">
            Find specific audit log entries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button type="submit">Search</Button>
          </form>
          
          {showFilters && (
            <AuditLogFilters
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          )}
        </CardContent>
      </Card>
      
      <AuditLogTable 
        searchQuery={searchQuery}
        dateRange={dateRange}
        filters={selectedFilters}
      />
    </div>
  );
}
