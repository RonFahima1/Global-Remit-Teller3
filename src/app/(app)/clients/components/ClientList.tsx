'use client';

import React, { useState, useEffect } from 'react';
import { useClient, Client } from '@/context/ClientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  MoreVertical, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Link from 'next/link';

export function ClientList() {
  const { state, searchClients } = useClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  
  // Apply search when term changes
  useEffect(() => {
    searchClients(searchTerm);
  }, [searchTerm, searchClients]);
  
  // Filter clients by KYC status
  const filteredClients = state.filteredClients.filter(client => {
    if (kycFilter === 'all') return true;
    return client.kycStatus === kycFilter;
  });
  
  // Get KYC status badge
  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card className="card-ios">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Clients</CardTitle>
        <Link href="/clients/new">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            New Client
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {kycFilter === 'all' ? 'All Statuses' : 
                  kycFilter === 'verified' ? 'Verified' : 
                  kycFilter === 'pending' ? 'Pending' : 'Rejected'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setKycFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setKycFilter('verified')}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Verified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setKycFilter('pending')}>
                <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setKycFilter('rejected')}>
                <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Client List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{client.firstName} {client.lastName}</div>
                      <div className="text-sm text-gray-500">{client.id} • {client.contact.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getKycStatusBadge(client.kycStatus)}
                    
                    <div className="text-sm text-gray-500 hidden md:block">
                      Last updated: {formatDate(client.updatedAt)}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/clients/${client.id}`}>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/clients/${client.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Link href={`/clients/${client.id}`} className="hidden sm:block">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
              >
                {searchTerm || kycFilter !== 'all' ? (
                  <div className="space-y-2">
                    <p>No clients match your filters</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSearchTerm('');
                        setKycFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <p>No clients found. Add a new client to get started.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
