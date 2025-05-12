'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ClientSearch } from '@/components/clients/ClientSearch';
import { useClient } from '@/context/ClientContext';
import { formatCurrency } from '@/utils/format';

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

  return (
    <Card className="card-ios">
      <CardHeader>
        <CardTitle className="text-h3 font-h3">Find Client</CardTitle>
        <CardDescription>Search for a client to process a deposit</CardDescription>
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
                      <p className="text-xs text-muted-foreground">
                        {client.kycStatus === 'verified' ? 'Verified' : client.kycStatus}
                      </p>
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
              <div className="flex flex-col items-end">
                {state.selectedClient.balances?.map((balance: any) => (
                  <div key={balance.currency} className="text-right">
                    <span className="font-bold">{formatCurrency(balance.amount, balance.currency)}</span>
                    <span className="text-sm text-muted-foreground ml-1">{balance.currency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
