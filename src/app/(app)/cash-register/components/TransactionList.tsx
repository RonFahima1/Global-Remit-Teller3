'use client';

import React, { useState } from 'react';
import { useCashRegister, CashTransaction } from '@/context/CashRegisterContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Minus, Search, Calendar, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { TransactionDetails } from './TransactionDetails';

export function TransactionList() {
  const { state } = useCashRegister();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'add' | 'remove'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<CashTransaction | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Filter transactions based on search term, type, and date
  const filteredTransactions = state.transactions
    .filter(txn => txn.currency === state.selectedCurrency)
    .filter(txn => {
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          txn.description.toLowerCase().includes(searchLower) ||
          txn.id.toLowerCase().includes(searchLower) ||
          txn.performedBy.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(txn => {
      // Filter by transaction type
      if (filterType === 'all') return true;
      return txn.type === filterType;
    })
    .filter(txn => {
      // Filter by date
      if (!selectedDate) return true;
      const txnDate = new Date(txn.date);
      return (
        txnDate.getDate() === selectedDate.getDate() &&
        txnDate.getMonth() === selectedDate.getMonth() &&
        txnDate.getFullYear() === selectedDate.getFullYear()
      );
    });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setSelectedDate(undefined);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    
    // Check if date is yesterday
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    }
    
    // Otherwise, return full date
    return format(date, 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'add' | 'remove')}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="add">Add Cash</SelectItem>
              <SelectItem value="remove">Remove Cash</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'MMM d, yyyy') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {(searchTerm || filterType !== 'all' || selectedDate) && (
            <Button variant="ghost" onClick={clearFilters} size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((txn) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-gray-100 dark:border-gray-800 cursor-pointer"
                onClick={() => {
                  setSelectedTransaction(txn);
                  setDetailsModalOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    txn.type === 'add' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  )}>
                    {txn.type === 'add' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{txn.id}</span>
                      <span>•</span>
                      <span>{formatDate(txn.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={cn(
                    'font-medium',
                    txn.type === 'add' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {txn.type === 'add' ? '+' : '-'}
                    {txn.amount.toLocaleString()} {txn.currency}
                  </p>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
            >
              {searchTerm || filterType !== 'all' || selectedDate ? (
                <div className="space-y-2">
                  <p>No transactions match your filters</p>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <p>No transactions for this currency.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetails 
        transaction={selectedTransaction} 
        isOpen={detailsModalOpen} 
        onClose={() => setDetailsModalOpen(false)} 
      />
    </div>
  );
}
