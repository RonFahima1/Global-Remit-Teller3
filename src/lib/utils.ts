import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const themeColors = {
  primary: "#0066cc", // Global Remit blue
  accent: "#ffd700", // Global Remit gold
  background: {
    light: "#ffffff",
    dark: "#0a0a0a",
  },
  text: {
    light: "#0a0a0a",
    dark: "#ffffff",
  },
}

/**
 * Format a number as currency with the specified currency code
 * @param amount The amount to format
 * @param currencyCode The ISO currency code (USD, EUR, etc.)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string or Date object to a readable format
 * @param dateString ISO date string or Date object
 * @param includeTime Whether to include the time in the formatted string
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date, includeTime: boolean = true): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (includeTime) {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
