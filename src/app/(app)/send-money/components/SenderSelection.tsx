'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, CheckCircle, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTransfer } from '@/context/transfer-context';
import { Sender } from '@/context/transfer-context';
import { getSenders } from '@/services/transfer-service';
import { handleApiError } from '@/utils/api-error-handler';

export const SenderSelection: React.FC = () => {
  const { state, dispatch } = useTransfer();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [senders, setSenders] = useState<Sender[]>([]);
  const [filteredSenders, setFilteredSenders] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Handle search query debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Load all senders on component mount
  useEffect(() => {
    const loadSenders = async () => {
      setLoading(true);
      try {
        const data = await getSenders();
        setSenders(data);
        // Initially filter based on current search query if any
        if (debouncedQuery.length >= 2) {
          filterSenders(data, debouncedQuery);
        } else {
          setFilteredSenders(data);
        }
      } catch (error) {
        handleApiError(error, 'Failed to load senders');
      } finally {
        setLoading(false);
      }
    };
    
    loadSenders();
  }, []);
  
  // Filter senders when debounced query changes
  useEffect(() => {
    if (senders.length > 0) {
      filterSenders(senders, debouncedQuery);
    }
  }, [debouncedQuery, senders]);
  
  // Filter senders based on search query
  const filterSenders = (data: Sender[], query: string) => {
    if (query.length < 2) {
      setFilteredSenders(data);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter(sender => 
      sender.name.toLowerCase().includes(lowerQuery) ||
      sender.phone.toLowerCase().includes(lowerQuery) ||
      sender.id.toLowerCase().includes(lowerQuery) ||
      (sender.email && sender.email.toLowerCase().includes(lowerQuery))
    );
    
    setFilteredSenders(filtered);
  };
  
  const handleSelectSender = (sender: Sender) => {
    dispatch({ type: 'SET_SENDER', payload: sender });
    dispatch({ type: 'SET_STEP', payload: 2 });
    
    toast({
      title: 'Sender Selected',
      description: `${sender.name} has been selected as the sender.`,
    });
  };
  
  const handleNewSender = () => {
    // Navigate to create new sender form
    toast({
      title: 'Add New Sender',
      description: 'Redirecting to new sender form...',
    });
    // In a real implementation, we would navigate to a new sender form
    // or open a modal to create a new sender
  };
  return (
    <div className="max-w-4xl mx-auto">
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
      ) : filteredSenders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery.length < 2 
              ? "Enter at least 2 characters to search" 
              : "No senders found matching your search criteria"}
          </p>
          <Button 
            onClick={handleNewSender}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Sender
          </Button>
        </div>
      ) : (
        <div>
          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredSenders.length} {filteredSenders.length === 1 ? 'sender' : 'senders'} found
            </p>
          </div>
          
          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSenders.map((sender) => (
              <motion.div
                key={sender.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={cn(
                    "card-ios overflow-hidden cursor-pointer transition-all duration-200",
                    state.sender?.id === sender.id && "ring-2 ring-primary"
                  )}
                  onClick={() => handleSelectSender(sender)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{sender.name}</h3>
                        <p className="text-muted-foreground text-sm">ID: {sender.id}</p>
                      </div>
                      {state.sender?.id === sender.id && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{sender.phone}</span>
                      </div>
                      
                      {sender.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{sender.email}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{sender.country}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Add new sender button */}
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleNewSender}
              variant="outline"
              className="border-dashed border-primary/50"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Add New Sender
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
