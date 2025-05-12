'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import {
  AuditAction,
  AuditModule,
  AuditStatus,
  logAuditEvent,
  logClientEvent,
  logTransactionEvent,
  logKycEvent,
  logLimitExceptionEvent,
  logAuthEvent,
  logSystemEvent,
  logUserEvent,
  AuditLogEntry
} from '@/utils/audit-logger';

// Define the context type
interface AuditLogContextType {
  logEvent: (entry: AuditLogEntry) => Promise<string>;
  logClientEvent: (
    action: AuditAction,
    details: string,
    status?: AuditStatus,
    metadata?: Record<string, any>
  ) => Promise<string>;
  logTransactionEvent: (
    action: AuditAction,
    details: string,
    status?: AuditStatus,
    metadata?: Record<string, any>
  ) => Promise<string>;
  logKycEvent: (
    action: AuditAction,
    details: string,
    status?: AuditStatus,
    metadata?: Record<string, any>
  ) => Promise<string>;
  logLimitExceptionEvent: (
    action: AuditAction,
    details: string,
    status?: AuditStatus,
    metadata?: Record<string, any>
  ) => Promise<string>;
  logAuthEvent: (
    action: AuditAction,
    details: string,
    status?: AuditStatus,
    metadata?: Record<string, any>
  ) => Promise<string>;
  logSystemEvent: (
    action: AuditAction,
    details: string,
    status?: AuditStatus,
    metadata?: Record<string, any>
  ) => Promise<string>;
  logUserEvent: (
    action: AuditAction,
    details: string,
    status?: AuditStatus,
    metadata?: Record<string, any>
  ) => Promise<string>;
}

// Create the context with a default value
const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

// Provider component
interface AuditLogProviderProps {
  children: ReactNode;
  userId: string;
}

export function AuditLogProvider({ children, userId }: AuditLogProviderProps) {
  // Log a generic event
  const logEvent = useCallback(
    (entry: AuditLogEntry) => {
      return logAuditEvent(entry);
    },
    []
  );

  // Log client-related events
  const logClientEventWithUser = useCallback(
    (
      action: AuditAction,
      details: string,
      status: AuditStatus = 'success',
      metadata?: Record<string, any>
    ) => {
      return logClientEvent(action, details, userId, status, metadata);
    },
    [userId]
  );

  // Log transaction-related events
  const logTransactionEventWithUser = useCallback(
    (
      action: AuditAction,
      details: string,
      status: AuditStatus = 'success',
      metadata?: Record<string, any>
    ) => {
      return logTransactionEvent(action, details, userId, status, metadata);
    },
    [userId]
  );

  // Log KYC-related events
  const logKycEventWithUser = useCallback(
    (
      action: AuditAction,
      details: string,
      status: AuditStatus = 'success',
      metadata?: Record<string, any>
    ) => {
      return logKycEvent(action, details, userId, status, metadata);
    },
    [userId]
  );

  // Log limit exception events
  const logLimitExceptionEventWithUser = useCallback(
    (
      action: AuditAction,
      details: string,
      status: AuditStatus = 'success',
      metadata?: Record<string, any>
    ) => {
      return logLimitExceptionEvent(action, details, userId, status, metadata);
    },
    [userId]
  );

  // Log authentication events
  const logAuthEventWithUser = useCallback(
    (
      action: AuditAction,
      details: string,
      status: AuditStatus = 'success',
      metadata?: Record<string, any>
    ) => {
      return logAuthEvent(action, details, userId, status, metadata);
    },
    [userId]
  );

  // Log system events
  const logSystemEventWithUser = useCallback(
    (
      action: AuditAction,
      details: string,
      status: AuditStatus = 'success',
      metadata?: Record<string, any>
    ) => {
      return logSystemEvent(action, details, userId, status, metadata);
    },
    [userId]
  );

  // Log user management events
  const logUserEventWithUser = useCallback(
    (
      action: AuditAction,
      details: string,
      status: AuditStatus = 'success',
      metadata?: Record<string, any>
    ) => {
      return logUserEvent(action, details, userId, status, metadata);
    },
    [userId]
  );

  // Create the context value
  const contextValue: AuditLogContextType = {
    logEvent,
    logClientEvent: logClientEventWithUser,
    logTransactionEvent: logTransactionEventWithUser,
    logKycEvent: logKycEventWithUser,
    logLimitExceptionEvent: logLimitExceptionEventWithUser,
    logAuthEvent: logAuthEventWithUser,
    logSystemEvent: logSystemEventWithUser,
    logUserEvent: logUserEventWithUser,
  };

  return (
    <AuditLogContext.Provider value={contextValue}>
      {children}
    </AuditLogContext.Provider>
  );
}

// Custom hook to use the audit log context
export function useAuditLog() {
  const context = useContext(AuditLogContext);
  
  if (context === undefined) {
    throw new Error('useAuditLog must be used within an AuditLogProvider');
  }
  
  return context;
}
