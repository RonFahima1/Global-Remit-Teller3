import { formatCurrency } from './format';

/**
 * Types for limit management
 */
export type LimitType = 'daily' | 'weekly' | 'monthly' | 'perTransaction';
export type ClientType = 'individual' | 'business' | 'vip';
export type LimitStatus = 'active' | 'exceeded' | 'approaching' | 'inactive';
export type ExceptionStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface LimitSetting {
  enabled: boolean;
  amount: number;
  currency: string;
}

export interface LimitUsage {
  used: number;
  remaining: number | null;
  percentage: number;
}

export interface LimitException {
  id: string;
  clientId: string;
  clientName: string;
  limitType: string;
  requestedAmount: number;
  currency: string;
  reason: string;
  status: ExceptionStatus;
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  expiresAt: string;
  notes?: string;
}

/**
 * Calculate limit usage percentage
 */
export function calculateUsagePercentage(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min((used / limit) * 100, 100);
}

/**
 * Get color based on usage percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 70) return 'bg-yellow-500';
  return 'bg-green-500';
}

/**
 * Calculate progress bar width
 */
export function getProgressWidth(percentage: number): string {
  return `${Math.min(percentage, 100)}%`;
}

/**
 * Format limit display
 */
export function formatLimit(limit: LimitSetting): string {
  if (!limit.enabled) return 'No limit';
  return formatCurrency(limit.amount, limit.currency);
}

/**
 * Get limit status based on usage
 */
export function getLimitStatus(used: number, limit: number, enabled: boolean): LimitStatus {
  if (!enabled) return 'inactive';
  
  const percentage = calculateUsagePercentage(used, limit);
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 80) return 'approaching';
  return 'active';
}

/**
 * Format date for display
 */
export function formatLimitDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get default limits by client type
 */
export function getDefaultLimitsByClientType(clientType: ClientType, currency: string = 'USD'): Record<LimitType, LimitSetting> {
  switch (clientType) {
    case 'individual':
      return {
        daily: { enabled: true, amount: 3000, currency },
        weekly: { enabled: true, amount: 10000, currency },
        monthly: { enabled: true, amount: 30000, currency },
        perTransaction: { enabled: true, amount: 1500, currency },
      };
    case 'business':
      return {
        daily: { enabled: true, amount: 10000, currency },
        weekly: { enabled: true, amount: 50000, currency },
        monthly: { enabled: true, amount: 150000, currency },
        perTransaction: { enabled: true, amount: 5000, currency },
      };
    case 'vip':
      return {
        daily: { enabled: true, amount: 25000, currency },
        weekly: { enabled: true, amount: 100000, currency },
        monthly: { enabled: true, amount: 300000, currency },
        perTransaction: { enabled: true, amount: 15000, currency },
      };
  }
}

/**
 * Validate a limit setting
 */
export function validateLimitSetting(limit: LimitSetting): string | null {
  if (limit.enabled && limit.amount <= 0) {
    return 'Limit amount must be greater than 0';
  }
  return null;
}

/**
 * Check if a transaction would exceed limits
 */
export function wouldExceedLimits(
  amount: number, 
  currency: string,
  clientLimits: Record<LimitType, LimitSetting>,
  usages: Record<LimitType, LimitUsage>
): { exceeded: boolean; limitType: LimitType | null } {
  // Check per transaction limit
  if (
    clientLimits.perTransaction.enabled && 
    amount > clientLimits.perTransaction.amount && 
    currency === clientLimits.perTransaction.currency
  ) {
    return { exceeded: true, limitType: 'perTransaction' };
  }
  
  // Check daily limit
  if (
    clientLimits.daily.enabled && 
    usages.daily.used + amount > clientLimits.daily.amount && 
    currency === clientLimits.daily.currency
  ) {
    return { exceeded: true, limitType: 'daily' };
  }
  
  // Check weekly limit
  if (
    clientLimits.weekly.enabled && 
    usages.weekly.used + amount > clientLimits.weekly.amount && 
    currency === clientLimits.weekly.currency
  ) {
    return { exceeded: true, limitType: 'weekly' };
  }
  
  // Check monthly limit
  if (
    clientLimits.monthly.enabled && 
    usages.monthly.used + amount > clientLimits.monthly.amount && 
    currency === clientLimits.monthly.currency
  ) {
    return { exceeded: true, limitType: 'monthly' };
  }
  
  return { exceeded: false, limitType: null };
}
