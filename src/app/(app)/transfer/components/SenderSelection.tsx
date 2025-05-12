/**
 * Sender Selection Component
 * First step in the money transfer process
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, ChevronRight, Clock, Star } from 'lucide-react';
import { useClientService } from '@/components/providers/service-provider';
import { toast } from 'sonner';

// Types
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  kycStatus: 'verified' | 'pending' | 'rejected' | 'not_started';
  riskLevel: 'low' | 'medium' | 'high';
  lastTransaction?: string;
  avatarUrl?: string;
}

interface SenderSelectionProps {
  onSenderSelected: (sender: Client) => void;
  onNewSender: () => void;
}

/**
 * Sender Selection Component
 */
export function SenderSelection({ onSenderSelected, onNewSender }: SenderSelectionProps) {
  const router = useRouter();
  const clientService = useClientService();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [favoriteClients, setFavoriteClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Fetch clients on mount and when search term changes
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        if (searchTerm) {
          // Search for clients
          const response = await clientService.searchClients(searchTerm);
          setClients(response.clients);
        } else {
          // Get recent clients
          const recents = await clientService.getRecentClients();
          setRecentClients(recents.clients);
          
          // Get favorite clients
          const favorites = await clientService.getFavoriteClients();
          setFavoriteClients(favorites.clients);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to fetch clients');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [searchTerm, clientService]);
  
  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (selectedClient) {
      onSenderSelected(selectedClient);
    } else {
      toast.error('Please select a sender to continue');
    }
  };
  
  // Get KYC status badge
  const getKycStatusBadge = (status: Client['kycStatus']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'not_started':
        return <Badge className="bg-gray-500">Not Started</Badge>;
      default:
        return null;
    }
  };
  
  // Get risk level badge
  const getRiskLevelBadge = (level: Client['riskLevel']) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-green-500">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-red-500">High Risk</Badge>;
      default:
        return null;
    }
  };
  
  // Get avatar fallback
  const getAvatarFallback = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Select Sender</CardTitle>
        <CardDescription>
          Select an existing client or create a new sender for this transaction
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email, or phone..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">
              <Clock className="mr-2 h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Star className="mr-2 h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="search" disabled={!searchTerm}>
              <Search className="mr-2 h-4 w-4" />
              Search Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="space-y-4 pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recentClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent clients found</p>
                <Button variant="outline" className="mt-4" onClick={onNewSender}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Sender
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedClient?.id} onValueChange={(value) => {
                const client = recentClients.find(c => c.id === value);
                if (client) handleClientSelect(client);
              }}>
                <div className="space-y-2">
                  {recentClients.map((client) => (
                    <div
                      key={client.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer ${
                        selectedClient?.id === client.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleClientSelect(client)}
                    >
                      <RadioGroupItem value={client.id} id={`client-${client.id}`} />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={client.avatarUrl} alt={`${client.firstName} ${client.lastName}`} />
                        <AvatarFallback>{getAvatarFallback(client.firstName, client.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.email || client.phone}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-1 items-end">
                        {getKycStatusBadge(client.kycStatus)}
                        {getRiskLevelBadge(client.riskLevel)}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-4 pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : favoriteClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No favorite clients found</p>
                <Button variant="outline" className="mt-4" onClick={onNewSender}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Sender
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedClient?.id} onValueChange={(value) => {
                const client = favoriteClients.find(c => c.id === value);
                if (client) handleClientSelect(client);
              }}>
                <div className="space-y-2">
                  {favoriteClients.map((client) => (
                    <div
                      key={client.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer ${
                        selectedClient?.id === client.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleClientSelect(client)}
                    >
                      <RadioGroupItem value={client.id} id={`favorite-${client.id}`} />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={client.avatarUrl} alt={`${client.firstName} ${client.lastName}`} />
                        <AvatarFallback>{getAvatarFallback(client.firstName, client.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.email || client.phone}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-1 items-end">
                        {getKycStatusBadge(client.kycStatus)}
                        {getRiskLevelBadge(client.riskLevel)}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4 pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No clients found matching "{searchTerm}"</p>
                <Button variant="outline" className="mt-4" onClick={onNewSender}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Sender
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedClient?.id} onValueChange={(value) => {
                const client = clients.find(c => c.id === value);
                if (client) handleClientSelect(client);
              }}>
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer ${
                        selectedClient?.id === client.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleClientSelect(client)}
                    >
                      <RadioGroupItem value={client.id} id={`search-${client.id}`} />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={client.avatarUrl} alt={`${client.firstName} ${client.lastName}`} />
                        <AvatarFallback>{getAvatarFallback(client.firstName, client.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.email || client.phone}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-1 items-end">
                        {getKycStatusBadge(client.kycStatus)}
                        {getRiskLevelBadge(client.riskLevel)}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onNewSender}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Sender
          </Button>
          <Button onClick={handleContinue} disabled={!selectedClient}>
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
