'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useClient } from '@/context/ClientContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, X, User, Phone, Mail, ArrowRight } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { useKeyPress } from '@/hooks/use-key-press';
import Link from 'next/link';

interface ClientSearchProps {
  onClientSelect?: (clientId: string) => void;
  showNewButton?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function ClientSearch({ 
  onClientSelect, 
  showNewButton = true, 
  placeholder = 'Search clients...', 
  autoFocus = false,
  className = ''
}: ClientSearchProps) {
  const router = useRouter();
  const { state, searchClients } = useClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Handle search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchClients(debouncedSearchTerm);
      setIsSearchOpen(true);
    } else {
      searchClients('');
      setIsSearchOpen(false);
    }
  }, [debouncedSearchTerm, searchClients]);
  
  // Auto focus the input if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Close search panel when clicking outside
  useOnClickOutside(searchRef, () => {
    setIsSearchOpen(false);
  });
  
  // Handle keyboard navigation
  const downPress = useKeyPress('ArrowDown');
  const upPress = useKeyPress('ArrowUp');
  const enterPress = useKeyPress('Enter');
  const escPress = useKeyPress('Escape');
  
  useEffect(() => {
    if (isSearchOpen) {
      if (downPress) {
        setSelectedIndex(prevIndex => 
          prevIndex < state.filteredClients.length - 1 ? prevIndex + 1 : prevIndex
        );
      }
    }
  }, [downPress, isSearchOpen, state.filteredClients.length]);
  
  useEffect(() => {
    if (isSearchOpen) {
      if (upPress) {
        setSelectedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
      }
    }
  }, [upPress, isSearchOpen]);
  
  useEffect(() => {
    if (isSearchOpen && enterPress && selectedIndex >= 0) {
      handleClientSelect(state.filteredClients[selectedIndex].id);
    }
  }, [enterPress, isSearchOpen, selectedIndex, state.filteredClients]);
  
  useEffect(() => {
    if (escPress) {
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  }, [escPress]);
  
  // Reset selected index when filtered clients change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [state.filteredClients]);
  
  const handleClientSelect = (clientId: string) => {
    if (onClientSelect) {
      onClientSelect(clientId);
    } else {
      router.push(`/clients/${clientId}`);
    }
    setIsSearchOpen(false);
    setSearchTerm('');
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };
  
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="pl-10 pr-10"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm && setIsSearchOpen(true)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        {showNewButton && (
          <Button asChild>
            <Link href="/clients/new">
              <UserPlus className="mr-2 h-4 w-4" />
              New Client
            </Link>
          </Button>
        )}
      </div>
      
      {isSearchOpen && state.filteredClients.length > 0 && (
        <Card className="absolute z-50 mt-2 w-full max-h-[400px] overflow-y-auto shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="p-2">
            <p className="text-sm text-muted-foreground px-2 py-1.5">
              {state.filteredClients.length} result{state.filteredClients.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-1">
              {state.filteredClients.map((client, index) => (
                <div
                  key={client.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                    index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleClientSelect(client.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {client.firstName} {client.lastName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.contact.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.contact.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(client.kycStatus)}>
                      {client.kycStatus}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {isSearchOpen && searchTerm && state.filteredClients.length === 0 && (
        <Card className="absolute z-50 mt-2 w-full shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="p-4 text-center">
            <p className="text-muted-foreground">No clients found</p>
            {showNewButton && (
              <Button asChild className="mt-2">
                <Link href="/clients/new">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create New Client
                </Link>
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
