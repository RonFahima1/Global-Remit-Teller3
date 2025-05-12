'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ClientSearch } from '@/components/clients/ClientSearch';
import { useClient } from '@/context/ClientContext';

interface ClientSelectionProps {
  onClientSelected: (client: any) => void;
  isLoading: boolean;
}

export function ClientSelection({ onClientSelected, isLoading }: ClientSelectionProps) {
  const { state, selectClient } = useClient();
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleClientSelect = (client: any) => {
    selectClient(client);
    onClientSelected(client);
  };

  // Filter clients that need KYC verification
  const eligibleClients = state.filteredClients.filter(client => 
    client.kycStatus !== 'verified' && client.kycStatus !== 'rejected'
  );

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3">Select Client</CardTitle>
        <CardDescription>Search for a client to start the KYC verification process</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ClientSearch 
          placeholder="Search by name, phone, or ID..."
          autoFocus={true}
          onSelect={handleClientSelect}
          onSearchPerformed={() => setSearchPerformed(true)}
        />

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && searchPerformed && state.filteredClients.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No clients found. Try a different search term.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.href = '/clients/new'}
            >
              Create New Client
            </Button>
          </div>
        )}

        {!isLoading && state.filteredClients.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Search Results</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {state.filteredClients.map((client) => (
                <div 
                  key={client.id}
                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{client.firstName} {client.lastName}</p>
                      <p className="text-sm text-muted-foreground">{client.contact.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">ID: {client.id}</p>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        client.kycStatus === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : client.kycStatus === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : client.kycStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.kycStatus || 'Not Started'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.selectedClient && (
          <div className="mt-4 p-4 border rounded-lg bg-accent/20">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{state.selectedClient.firstName} {state.selectedClient.lastName}</h3>
                <p className="text-sm text-muted-foreground">Client ID: {state.selectedClient.id}</p>
                <p className="text-sm">{state.selectedClient.contact.phone}</p>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                state.selectedClient.kycStatus === 'verified' 
                  ? 'bg-green-100 text-green-800' 
                  : state.selectedClient.kycStatus === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : state.selectedClient.kycStatus === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {state.selectedClient.kycStatus || 'Not Started'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
