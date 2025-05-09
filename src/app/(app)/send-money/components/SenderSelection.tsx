import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Client } from '../hooks/useSendMoneyForm';
import { cn } from '@/lib/utils';

interface SenderSelectionProps {
  initialLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredClients: Client[];
  selectedSender: Client | null;
  setSelectedSender: (client: Client | null) => void;
  setShowNewSenderForm: (show: boolean) => void;
}

export const SenderSelection: React.FC<SenderSelectionProps> = ({
  initialLoading,
  searchQuery,
  setSearchQuery,
  filteredClients,
  selectedSender,
  setSelectedSender,
  setShowNewSenderForm
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Search bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by name, phone or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-base rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* Loading state */}
      {initialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-32"></div>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No senders found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Try a different search or add a new sender</p>
          <Button
            onClick={() => setShowNewSenderForm(true)}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Sender
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="h-full"
              >
                <div 
                  onClick={() => setSelectedSender(client)}
                  className={cn(
                    "relative h-full p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedSender?.id === client.id 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" 
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800"
                  )}
                >
                  {selectedSender?.id === client.id && (
                    <div className="absolute top-3 right-3 text-blue-500">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-lg shadow-sm">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-lg">{client.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400">ID:</div>
                    <div className="text-gray-900 dark:text-gray-200 font-medium">{client.id}</div>
                    
                    <div className="text-gray-500 dark:text-gray-400">ID Type:</div>
                    <div className="text-gray-900 dark:text-gray-200 font-medium">{client.idType || 'Passport'}</div>
                    
                    <div className="text-gray-500 dark:text-gray-400">Status:</div>
                    <div className="text-green-600 dark:text-green-400 font-medium">Active</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setShowNewSenderForm(true)}
              variant="outline"
              className="inline-flex items-center px-6 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Add New Sender
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
