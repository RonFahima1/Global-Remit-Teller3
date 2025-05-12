'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, CheckCircle, Phone, Mail, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTransfer } from '@/context/transfer-context';
import { Receiver } from '@/context/transfer-context';
import { getReceivers } from '@/services/transfer-service';
import { handleApiError } from '@/utils/api-error-handler';

export const ReceiverSelection: React.FC = () => {
  const { state, dispatch } = useTransfer();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [filteredReceivers, setFilteredReceivers] = useState<Receiver[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Handle search query debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Load receivers for the selected sender
  useEffect(() => {
    if (!state.sender?.id) return;
    
    const loadReceivers = async () => {
      setLoading(true);
      try {
        const data = await getReceivers(state.sender!.id);
        setReceivers(data);
        // Initially filter based on current search query if any
        if (debouncedQuery.length >= 2) {
          filterReceivers(data, debouncedQuery);
        } else {
          setFilteredReceivers(data);
        }
      } catch (error) {
        handleApiError(error, 'Failed to load receivers');
      } finally {
        setLoading(false);
      }
    };
    
    loadReceivers();
  }, [state.sender?.id]);
  
  // Filter receivers when debounced query changes
  useEffect(() => {
    if (receivers.length > 0) {
      filterReceivers(receivers, debouncedQuery);
    }
  }, [debouncedQuery, receivers]);
  
  // Filter receivers based on search query
  const filterReceivers = (data: Receiver[], query: string) => {
    if (query.length < 2) {
      setFilteredReceivers(data);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter(receiver => 
      receiver.name.toLowerCase().includes(lowerQuery) ||
      receiver.phone.toLowerCase().includes(lowerQuery) ||
      receiver.id.toLowerCase().includes(lowerQuery) ||
      (receiver.email && receiver.email.toLowerCase().includes(lowerQuery))
    );
    
    setFilteredReceivers(filtered);
  };
  
  const handleSelectReceiver = (receiver: Receiver) => {
    dispatch({ type: 'SET_RECEIVER', payload: receiver });
    dispatch({ type: 'SET_STEP', payload: 3 });
    
    toast({
      title: 'Receiver Selected',
      description: `${receiver.name} has been selected as the receiver.`,
    });
  };
  
  const handleNewReceiver = () => {
    // Navigate to create new receiver form
    toast({
      title: 'Add New Receiver',
      description: 'Redirecting to new receiver form...',
    });
    // In a real implementation, we would navigate to a new receiver form
    // or open a modal to create a new receiver
  };
  
  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button and title */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="mr-2 rounded-full h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-medium">Select Receiver</h2>
      </div>
      
      {/* Selected sender info */}
      {state.sender && (
        <Card className="mb-6 bg-muted/30 card-ios">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Sending money from:</p>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <span className="text-primary font-medium">{state.sender.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium">{state.sender.name}</p>
                <p className="text-sm text-muted-foreground">{state.sender.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search by name, phone or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base rounded-[14px] border-border/50 shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
        />
      </div>
      
      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse bg-muted rounded-[14px] h-32"></div>
          ))}
        </div>
      ) : filteredReceivers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {!state.sender
              ? "Please select a sender first"
              : searchQuery.length < 2 
                ? "Enter at least 2 characters to search" 
                : "No receivers found matching your search criteria"}
          </p>
          {state.sender && (
            <Button 
              onClick={handleNewReceiver}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Add New Receiver
            </Button>
          )}
        </div>
      ) : (
        <div>
          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredReceivers.length} {filteredReceivers.length === 1 ? 'receiver' : 'receivers'} found
            </p>
          </div>
          
          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReceivers.map((receiver) => (
              <motion.div
                key={receiver.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={cn(
                    "card-ios overflow-hidden cursor-pointer transition-all duration-200",
                    state.receiver?.id === receiver.id && "ring-2 ring-primary"
                  )}
                  onClick={() => handleSelectReceiver(receiver)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{receiver.name}</h3>
                        <p className="text-muted-foreground text-sm">ID: {receiver.id}</p>
                      </div>
                      {state.receiver?.id === receiver.id && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{receiver.phone}</span>
                      </div>
                      
                      {receiver.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{receiver.email}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{receiver.country}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Add new receiver button */}
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleNewReceiver}
              variant="outline"
              className="border-dashed border-primary/50"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Add New Receiver
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
