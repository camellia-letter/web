'use client';

import { createContext, useContext, useMemo, ReactNode } from "react";
import { notifications } from "@mantine/notifications";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextValue {
  addToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo<ToastContextValue>(
    () => ({
      addToast: (type, message) => {
        const colorMap: Record<ToastType, string> = {
          success: 'green',
          error: 'red',
          warning: 'yellow',
          info: 'blue',
        };

        notifications.show({
          message,
          color: colorMap[type],
          autoClose: 4000,
        });
      },
    }),
    [],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
