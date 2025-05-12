import { addDays, subDays, format } from 'date-fns';
import { Transaction } from '@/app/(app)/reports/components/TransactionTable';

/**
 * Generates mock transaction data for reporting purposes
 * @param days Number of days to generate data for
 * @returns Array of mock transactions
 */
export function generateMockTransactions(days: number = 30): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Transaction types
  const transactionTypes = ['remittance', 'deposit', 'withdrawal', 'exchange'];
  
  // Status options
  const statusOptions = ['completed', 'pending', 'failed', 'cancelled'];
  
  // Currencies
  const currencies = ['USD', 'EUR', 'GBP', 'ILS', 'JPY'];
  
  // Clients
  const clients = [
    { id: 'C-001', name: 'John Smith' },
    { id: 'C-002', name: 'Jane Doe' },
    { id: 'C-003', name: 'Alex Morgan' },
    { id: 'C-004', name: 'Maria Rodriguez' },
    { id: 'C-005', name: 'David Wilson' },
    { id: 'C-006', name: 'Sarah Johnson' },
    { id: 'C-007', name: 'Michael Chen' },
    { id: 'C-008', name: 'Global Traders Ltd' },
    { id: 'C-009', name: 'ABC Corporation' },
    { id: 'C-010', name: 'Elena Petrova' },
  ];
  
  // Tellers
  const tellers = [
    'Sarah Johnson',
    'Michael Chen',
    'David Wilson',
    'James Brown',
    'Emma Davis',
  ];
  
  // Generate transactions for each day
  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    
    // Generate 5-15 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 11) + 5;
    
    for (let j = 0; j < transactionsPerDay; j++) {
      // Random hour between 9am and 5pm
      const hour = Math.floor(Math.random() * 9) + 9;
      const minute = Math.floor(Math.random() * 60);
      const transactionDate = new Date(date);
      transactionDate.setHours(hour, minute);
      
      // Random transaction type
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      
      // Random client
      const client = clients[Math.floor(Math.random() * clients.length)];
      
      // Random amount based on transaction type
      let amount = 0;
      if (type === 'remittance') {
        amount = Math.floor(Math.random() * 5000) + 500;
      } else if (type === 'deposit') {
        amount = Math.floor(Math.random() * 3000) + 200;
      } else if (type === 'withdrawal') {
        amount = Math.floor(Math.random() * 2000) + 100;
      } else {
        amount = Math.floor(Math.random() * 10000) + 1000;
      }
      
      // Random currency
      const currency = currencies[Math.floor(Math.random() * currencies.length)];
      
      // Status (weighted towards completed)
      const statusRandom = Math.random();
      let status = '';
      if (statusRandom < 0.7) {
        status = 'completed';
      } else if (statusRandom < 0.85) {
        status = 'pending';
      } else if (statusRandom < 0.95) {
        status = 'failed';
      } else {
        status = 'cancelled';
      }
      
      // Random teller
      const teller = tellers[Math.floor(Math.random() * tellers.length)];
      
      // Create transaction
      transactions.push({
        id: `TX-${(1000 + transactions.length).toString().padStart(6, '0')}`,
        date: transactionDate.toISOString(),
        type,
        clientName: client.name,
        clientId: client.id,
        amount,
        currency,
        status,
        tellerName: teller,
      });
    }
  }
  
  return transactions;
}

/**
 * Calculates KPI data from transactions
 * @param transactions Array of transactions
 * @param previousTransactions Array of transactions from previous period
 * @returns KPI data object
 */
export function calculateKpiData(transactions: Transaction[], previousTransactions: Transaction[]) {
  // Calculate total volume
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Calculate previous period volume
  const previousVolume = previousTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Calculate volume change percentage
  const volumeChangePercent = previousVolume === 0 
    ? 100 
    : ((totalVolume - previousVolume) / previousVolume) * 100;
  
  // Calculate transaction count
  const transactionCount = transactions.length;
  
  // Calculate previous period transaction count
  const previousCount = previousTransactions.length;
  
  // Calculate count change percentage
  const countChangePercent = previousCount === 0 
    ? 100 
    : ((transactionCount - previousCount) / previousCount) * 100;
  
  // Calculate average transaction size
  const averageTransactionSize = transactionCount === 0 
    ? 0 
    : totalVolume / transactionCount;
  
  // Calculate active clients
  const uniqueClients = new Set(transactions.map(tx => tx.clientId));
  const activeClients = uniqueClients.size;
  
  // Calculate previous period active clients
  const previousUniqueClients = new Set(previousTransactions.map(tx => tx.clientId));
  const previousActiveClients = previousUniqueClients.size;
  
  // Calculate clients change percentage
  const clientsChangePercent = previousActiveClients === 0 
    ? 100 
    : ((activeClients - previousActiveClients) / previousActiveClients) * 100;
  
  return {
    totalVolume,
    transactionCount,
    averageTransactionSize,
    activeClients,
    volumeChangePercent,
    countChangePercent,
    clientsChangePercent,
    currency: 'USD', // Default currency for display
  };
}

/**
 * Generates transaction volume data for charts
 * @param transactions Array of transactions
 * @returns Array of data points for charts
 */
export function generateVolumeChartData(transactions: Transaction[]) {
  const volumeByDate = new Map<string, { amount: number; count: number }>();
  
  // Group transactions by date
  transactions.forEach(tx => {
    const date = format(new Date(tx.date), 'yyyy-MM-dd');
    
    if (!volumeByDate.has(date)) {
      volumeByDate.set(date, { amount: 0, count: 0 });
    }
    
    const current = volumeByDate.get(date)!;
    current.amount += tx.amount;
    current.count += 1;
    
    volumeByDate.set(date, current);
  });
  
  // Convert to array and sort by date
  return Array.from(volumeByDate.entries())
    .map(([date, data]) => ({
      date,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Generates transaction distribution data for charts
 * @param transactions Array of transactions
 * @returns Array of data points for distribution charts
 */
export function generateDistributionChartData(transactions: Transaction[]) {
  const typeDistribution = new Map<string, { value: number; count: number }>();
  
  // Group transactions by type
  transactions.forEach(tx => {
    if (!typeDistribution.has(tx.type)) {
      typeDistribution.set(tx.type, { value: 0, count: 0 });
    }
    
    const current = typeDistribution.get(tx.type)!;
    current.value += tx.amount;
    current.count += 1;
    
    typeDistribution.set(tx.type, current);
  });
  
  // Colors for each transaction type
  const typeColors = {
    remittance: '#2563eb', // blue
    deposit: '#10b981',    // green
    withdrawal: '#f59e0b',  // yellow
    exchange: '#8b5cf6',   // purple
  };
  
  // Convert to array
  return Array.from(typeDistribution.entries())
    .map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      value: data.value,
      count: data.count,
      color: typeColors[name as keyof typeof typeColors] || '#6b7280', // gray fallback
    }));
}

/**
 * Filters transactions based on filter criteria
 * @param transactions Array of transactions
 * @param filters Filter criteria
 * @returns Filtered transactions
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: {
    dateFrom?: Date;
    dateTo?: Date;
    type?: string;
    clientName?: string;
    status?: string;
    currency?: string;
    minAmount?: string;
    maxAmount?: string;
    tellerName?: string;
  }
) {
  return transactions.filter(tx => {
    const txDate = new Date(tx.date);
    
    // Date range filter
    if (filters.dateFrom && txDate < filters.dateFrom) {
      return false;
    }
    
    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999); // End of day
      if (txDate > endDate) {
        return false;
      }
    }
    
    // Transaction type filter
    if (filters.type && filters.type !== 'all' && tx.type !== filters.type) {
      return false;
    }
    
    // Client name filter
    if (filters.clientName && !tx.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all' && tx.status !== filters.status) {
      return false;
    }
    
    // Currency filter
    if (filters.currency && filters.currency !== 'all' && tx.currency !== filters.currency) {
      return false;
    }
    
    // Amount range filter
    if (filters.minAmount && tx.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    
    if (filters.maxAmount && tx.amount > parseFloat(filters.maxAmount)) {
      return false;
    }
    
    // Teller name filter
    if (filters.tellerName && !tx.tellerName.toLowerCase().includes(filters.tellerName.toLowerCase())) {
      return false;
    }
    
    return true;
  });
}

/**
 * Exports transactions to CSV format
 * @param transactions Array of transactions to export
 * @returns CSV string
 */
export function exportTransactionsToCSV(transactions: Transaction[]): string {
  // Define CSV headers
  const headers = [
    'Transaction ID',
    'Date',
    'Type',
    'Client Name',
    'Client ID',
    'Amount',
    'Currency',
    'Status',
    'Teller',
  ];
  
  // Map transactions to CSV rows
  const rows = transactions.map(tx => [
    tx.id,
    format(new Date(tx.date), 'yyyy-MM-dd HH:mm:ss'),
    tx.type,
    tx.clientName,
    tx.clientId,
    tx.amount.toString(),
    tx.currency,
    tx.status,
    tx.tellerName,
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  return csvContent;
}

/**
 * Creates a downloadable blob from CSV content
 * @param csvContent CSV string content
 * @param filename Filename for the download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
