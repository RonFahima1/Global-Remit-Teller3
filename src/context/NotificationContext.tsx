"use client";

import { createContext, useContext, useState, useCallback, useReducer } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "CLEAR_ALL" };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
        unreadCount: state.unreadCount - (state.notifications.find((n) => n.id === action.payload)?.read ? 0 : 1),
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - (state.notifications.find((n) => n.id === action.payload)?.read ? 0 : 1),
      };
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };
    case "CLEAR_ALL":
      return initialState;
    default:
      return state;
  }
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    actionLabel?: string,
    onAction?: () => void
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      actionLabel?: string,
      onAction?: () => void
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = {
        id,
        type,
        title,
        message,
        timestamp: Date.now(),
        read: false,
        actionLabel,
        onAction,
      };

      dispatch({ type: "ADD_NOTIFICATION", payload: notification });

      // Show toast notification
      toast(message, {
        icon: type === "success" ? "✅" : type === "error" ? "❌" : type === "warning" ? "⚠️" : "ℹ️",
        duration: 5000,
      });
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  }, []);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: "MARK_AS_READ", payload: id });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: "MARK_ALL_AS_READ" });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export { useNotification as useNotifications }; 