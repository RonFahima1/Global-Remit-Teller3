'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { ClientSearch } from '@/components/clients/ClientSearch';
import { useClient } from '@/context/ClientContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


const getStatusPillClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'ios-status-pill-green';
    case 'inactive':
    case 'rejected':
      return 'ios-status-pill-red';
    case 'pending':
      return 'ios-status-pill-yellow';
    case 'verified':
      return 'ios-status-pill-blue';
    default:
      return 'ios-status-pill-gray';
  }
};

export default function ClientsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { state, searchClients, deleteClient, selectClient } = useClient();
    const [kycFilter, setKycFilter] = useState<string>('all');
    
    // Format client name
    const formatClientName = (firstName: string, lastName: string) => {
        return `${firstName} ${lastName}`;
    };
    
    // Get client status
    const getClientStatus = (client: any) => {
        return client.status || (client.kycStatus === 'verified' ? 'Active' : client.kycStatus);
    };
    
    // Filter clients by KYC status
    const filteredClients = state.filteredClients.filter(client => {
        if (kycFilter === 'all') return true;
        return client.kycStatus === kycFilter;
    });
    
    const handleClientSearch = (searchParams: any) => {
        console.log("Searching for client:", searchParams);
        const { type, value } = searchParams;
        
        if (!value) {
            searchClients('');
            return;
        }
        
        // Use the searchClients method from the context
        searchClients(value);
    };
    
    const handleViewClient = (client: any) => {
        selectClient(client);
        router.push(`/clients/${client.id}`);
    };
    
    const handleEditClient = (client: any) => {
        selectClient(client);
        router.push(`/clients/${client.id}/edit`);
    };
    
    const handleDeleteClient = (client: any) => {
        if (confirm(`Are you sure you want to delete ${formatClientName(client.firstName, client.lastName)}?`)) {
            deleteClient(client.id);
            toast({
                title: "Client deleted",
                description: `${formatClientName(client.firstName, client.lastName)} has been deleted.`,
            });
        }
    };


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-h1 font-h1 text-foreground">Clients</h1>
      </div>

      {/* Client Search Card */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Search Clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientSearch 
            placeholder="Search by name, phone, email..."
            autoFocus={true}
            showNewButton={true}
          />
        </CardContent>
      </Card>

      {/* KYC Filter */}
      <div className="flex gap-2 mb-4">
        <Button 
          variant={kycFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setKycFilter('all')}
          className="text-sm"
        >
          All
        </Button>
        <Button 
          variant={kycFilter === 'verified' ? 'default' : 'outline'}
          onClick={() => setKycFilter('verified')}
          className="text-sm"
        >
          Verified
        </Button>
        <Button 
          variant={kycFilter === 'pending' ? 'default' : 'outline'}
          onClick={() => setKycFilter('pending')}
          className="text-sm"
        >
          Pending
        </Button>
        <Button 
          variant={kycFilter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setKycFilter('rejected')}
          className="text-sm"
        >
          Rejected
        </Button>
      </div>
      
      {/* Client List Table */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle className="text-h3 font-h3 text-card-foreground">Client List</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Client ID</TableHead>
                  <TableHead className="min-w-[250px]">Name</TableHead>
                  <TableHead className="min-w-[180px]">Phone</TableHead>
                  <TableHead className="min-w-[300px]">Email</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{formatClientName(client.firstName, client.lastName)}</TableCell>
                      <TableCell>{client.contact.phone}</TableCell>
                      <TableCell>{client.contact.email}</TableCell>
                      <TableCell>
                        <span className={`ios-status-pill ${getStatusPillClass(getClientStatus(client))}`}>
                          {getClientStatus(client)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => handleViewClient(client)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClient(client)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 dark:text-red-400"
                              onClick={() => handleDeleteClient(client)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No clients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Client Button at the bottom using the same pattern */}
      <div className="flex justify-end mt-6">
        <CustomerSearch
          onSearch={() => {}}
          showNewButton={true}
          newButtonText="New Client"
          newButtonLink="/clients/new"
          hideSearch={true} // Custom prop to hide search fields if supported
        />
      </div>
    </div>
  );
}

