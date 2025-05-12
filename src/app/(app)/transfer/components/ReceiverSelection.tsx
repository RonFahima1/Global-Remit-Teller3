/**
 * Receiver Selection Component
 * Second step in the money transfer process
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, ChevronRight, ChevronLeft, Clock, Star } from 'lucide-react';
import { useClientService, useTransactionService } from '@/components/providers/service-provider';
import { toast } from 'sonner';

// Types
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
}

interface Sender {
  id: string;
  firstName: string;
  lastName: string;
}

interface ReceiverSelectionProps {
  sender: Sender;
  onReceiverSelected: (receiver: Client) => void;
  onNewReceiver: () => void;
  onBack: () => void;
}

/**
 * Receiver Selection Component
 */
export function ReceiverSelection({ 
  sender, 
  onReceiverSelected, 
  onNewReceiver, 
  onBack 
}: ReceiverSelectionProps) {
  const clientService = useClientService();
  const transactionService = useTransactionService();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [recentReceivers, setRecentReceivers] = useState<Client[]>([]);
  const [frequentReceivers, setFrequentReceivers] = useState<Client[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<Client | null>(null);
  
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
          // Get recent receivers for this sender
          const recents = await transactionService.getRecentReceivers(sender.id);
          setRecentReceivers(recents.receivers);
          
          // Get frequent receivers for this sender
          const frequents = await transactionService.getFrequentReceivers(sender.id);
          setFrequentReceivers(frequents.receivers);
        }
      } catch (error) {
        console.error('Error fetching receivers:', error);
        toast.error('Failed to fetch receivers');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [searchTerm, sender.id, clientService, transactionService]);
  
  // Handle receiver selection
  const handleReceiverSelect = (receiver: Client) => {
    setSelectedReceiver(receiver);
  };
  
  // Handle continue button click
  const handleContinue = () => {
    if (selectedReceiver) {
      onReceiverSelected(selectedReceiver);
    } else {
      toast.error('Please select a receiver to continue');
    }
  };
  
  // Get avatar fallback
  const getAvatarFallback = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Select Receiver</CardTitle>
        <CardDescription>
          Select a recipient for {sender.firstName} {sender.lastName}'s transfer
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search receivers by name, email, or phone..."
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
            <TabsTrigger value="frequent">
              <Star className="mr-2 h-4 w-4" />
              Frequent
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
            ) : recentReceivers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent receivers found for this sender</p>
                <Button variant="outline" className="mt-4" onClick={onNewReceiver}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Receiver
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedReceiver?.id} onValueChange={(value) => {
                const receiver = recentReceivers.find(r => r.id === value);
                if (receiver) handleReceiverSelect(receiver);
              }}>
                <div className="space-y-2">
                  {recentReceivers.map((receiver) => (
                    <div
                      key={receiver.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer ${
                        selectedReceiver?.id === receiver.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleReceiverSelect(receiver)}
                    >
                      <RadioGroupItem value={receiver.id} id={`receiver-${receiver.id}`} />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={receiver.avatarUrl} alt={`${receiver.firstName} ${receiver.lastName}`} />
                        <AvatarFallback>{getAvatarFallback(receiver.firstName, receiver.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{receiver.firstName} {receiver.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          {receiver.email || receiver.phone}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-1 items-end">
                        {receiver.country && (
                          <Badge variant="outline">{receiver.country}</Badge>
                        )}
                        {receiver.city && (
                          <span className="text-xs text-muted-foreground">{receiver.city}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </TabsContent>
          
          <TabsContent value="frequent" className="space-y-4 pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : frequentReceivers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No frequent receivers found for this sender</p>
                <Button variant="outline" className="mt-4" onClick={onNewReceiver}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Receiver
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedReceiver?.id} onValueChange={(value) => {
                const receiver = frequentReceivers.find(r => r.id === value);
                if (receiver) handleReceiverSelect(receiver);
              }}>
                <div className="space-y-2">
                  {frequentReceivers.map((receiver) => (
                    <div
                      key={receiver.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer ${
                        selectedReceiver?.id === receiver.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleReceiverSelect(receiver)}
                    >
                      <RadioGroupItem value={receiver.id} id={`frequent-${receiver.id}`} />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={receiver.avatarUrl} alt={`${receiver.firstName} ${receiver.lastName}`} />
                        <AvatarFallback>{getAvatarFallback(receiver.firstName, receiver.lastName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{receiver.firstName} {receiver.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          {receiver.email || receiver.phone}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-1 items-end">
                        {receiver.country && (
                          <Badge variant="outline">{receiver.country}</Badge>
                        )}
                        {receiver.city && (
                          <span className="text-xs text-muted-foreground">{receiver.city}</span>
                        )}
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
                <Button variant="outline" className="mt-4" onClick={onNewReceiver}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Receiver
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedReceiver?.id} onValueChange={(value) => {
                const receiver = clients.find(c => c.id === value);
                if (receiver) handleReceiverSelect(receiver);
              }}>
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer ${
                        selectedReceiver?.id === client.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleReceiverSelect(client)}
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
                        {client.country && (
                          <Badge variant="outline">{client.country}</Badge>
                        )}
                        {client.city && (
                          <span className="text-xs text-muted-foreground">{client.city}</span>
                        )}
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
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onNewReceiver}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Receiver
          </Button>
          <Button onClick={handleContinue} disabled={!selectedReceiver}>
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
