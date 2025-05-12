/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (e.g., USD, EUR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a percentage value with a + or - sign
 * @param value The percentage value to format
 * @param decimalPlaces Number of decimal places to show
 * @param showSign Whether to show the + sign for positive values
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimalPlaces: number = 1, showSign: boolean = true): string => {
  const absValue = Math.abs(value);
  const formattedValue = absValue.toFixed(decimalPlaces);
  
  if (value === 0) return `0${decimalPlaces > 0 ? `.${"0".repeat(decimalPlaces)}` : ""}%`;
  
  const sign = value > 0 ? (showSign ? '+' : '') : '-';
  return `${sign}${formattedValue}%`;
};

/**
 * Format a date to a localized string
 * @param date The date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
): string => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Generate a transaction ID
 * @param prefix Prefix for the transaction ID
 * @returns A unique transaction ID
 */
export const generateTransactionId = (prefix: string = 'TX'): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${randomStr}`;
};

/**
 * Format a phone number
 * @param phone The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Basic formatting - in a real app, you'd use a library like libphonenumber-js
  if (!phone) return '';
  
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if we can't format it
  return phone;
};
