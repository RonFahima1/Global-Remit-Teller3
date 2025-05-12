/**
 * Payout Partners List Component
 * Displays a list of payout partners with filtering
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Search,
  RefreshCw,
  Globe,
  DollarSign,
  Truck,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { usePayouts } from '@/hooks/usePayouts';
import { PayoutPartner, PayoutMethod } from '@/types/payout';
import { Badge } from '@/components/ui/badge';

/**
 * Payout Partners List Props
 */
interface PayoutPartnersListProps {
  onSelectPartner: (partner: PayoutPartner) => void;
}

/**
 * Payout Partners List Component
 */
export function PayoutPartnersList({ onSelectPartner }: PayoutPartnersListProps) {
  const { 
    partners, 
    isLoading, 
    error, 
    loadAllPartners, 
    loadPartnersByFilter 
  } = usePayouts();
  
  // State for filtering
  const [filteredPartners, setFilteredPartners] = useState<PayoutPartner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [currencyFilter, setCurrencyFilter] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Get unique values for filter dropdowns
  const uniqueCountries = [...new Set(partners.flatMap(partner => partner.supportedCountries))];
  const uniqueCurrencies = [...new Set(partners.flatMap(partner => partner.supportedCurrencies))];
  
  // Load partners on component mount
  useEffect(() => {
    loadAllPartners();
  }, [loadAllPartners]);
  
  // Update filtered partners when partners or filters change
  useEffect(() => {
    let result = [...partners];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(partner => 
        partner.name.toLowerCase().includes(query) ||
        partner.code.toLowerCase().includes(query) ||
        (partner.description && partner.description.toLowerCase().includes(query))
      );
    }
    
    // Apply country filter
    if (countryFilter) {
      result = result.filter(partner => partner.supportedCountries.includes(countryFilter));
    }
    
    // Apply currency filter
    if (currencyFilter) {
      result = result.filter(partner => partner.supportedCurrencies.includes(currencyFilter));
    }
    
    // Apply method filter
    if (methodFilter) {
      result = result.filter(partner => 
        partner.supportedMethods.includes(methodFilter as PayoutMethod)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      const isActive = statusFilter === 'active';
      result = result.filter(partner => partner.isActive === isActive);
    }
    
    setFilteredPartners(result);
  }, [partners, searchQuery, countryFilter, currencyFilter, methodFilter, statusFilter]);
  
  // Handle refresh click
  const handleRefresh = () => {
    loadAllPartners();
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setCountryFilter('');
    setCurrencyFilter('');
    setMethodFilter('');
    setStatusFilter('');
  };
  
  // Format country code to country name
  const formatCountry = (code: string) => {
    // In a real app, we would use a library like i18n-iso-countries
    // For now, just return the code
    return code;
  };
  
  return (
    <Card className="card-ios">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Payout Partners</CardTitle>
            <CardDescription>
              View and manage payout partners for money transfers
            </CardDescription>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country}>{formatCountry(country)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Currencies</SelectItem>
                {uniqueCurrencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Methods</SelectItem>
                <SelectItem value={PayoutMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
                <SelectItem value={PayoutMethod.CASH_PICKUP}>Cash Pickup</SelectItem>
                <SelectItem value={PayoutMethod.MOBILE_WALLET}>Mobile Wallet</SelectItem>
                <SelectItem value={PayoutMethod.HOME_DELIVERY}>Home Delivery</SelectItem>
                <SelectItem value={PayoutMethod.DEBIT_CARD}>Debit Card</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" onClick={handleResetFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading partners...</span>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && filteredPartners.length === 0 && (
          <div className="flex flex-col justify-center items-center py-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No payout partners found</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              No payout partners match your current filters. Try adjusting your search or filters.
            </p>
          </div>
        )}
        
        {/* Partners grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map(partner => (
            <Card 
              key={partner.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectPartner(partner)}
            >
              <div className="h-2 bg-primary" />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{partner.code}</p>
                  </div>
                  {partner.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                  )}
                </div>
                
                {partner.description && (
                  <p className="text-sm mb-4 line-clamp-2">{partner.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{partner.supportedCountries.length} Countries</span>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{partner.supportedCurrencies.length} Currencies</span>
                  </div>
                  
                  <div className="flex items-center col-span-2">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="truncate">
                      {partner.supportedMethods.map(method => {
                        switch (method) {
                          case PayoutMethod.BANK_TRANSFER: return 'Bank';
                          case PayoutMethod.CASH_PICKUP: return 'Cash';
                          case PayoutMethod.MOBILE_WALLET: return 'Mobile';
                          case PayoutMethod.HOME_DELIVERY: return 'Delivery';
                          case PayoutMethod.DEBIT_CARD: return 'Card';
                          default: return method;
                        }
                      }).join(', ')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
