
export interface NotificationMessage {
  id: string;
  text: string;
  type: 'payment' | 'event' | 'inactive' | 'info';
  read?: boolean;
  createdAt?: string;
  action?: {
    url: string;
    text: string;
  };
}

// Additional types for notification functionality
export interface HeaderNotificationsOptions {
  cacheDuration?: number; // in milliseconds
  enableRetry?: boolean;
  maxRetries?: number;
  debug?: boolean;
}

export interface NotificationsState {
  importantMessages: NotificationMessage[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastFetched?: number;
  showSystemMessages?: boolean;
}

export interface NotificationCacheStatus {
  status: 'valid' | 'expired' | 'none';
  timestamp?: number;
}

// Type for notification center
export interface NotificationCenterProps {
  notifications: NotificationMessage[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: boolean;
  hasError: boolean;
  refreshNotifications: () => void;
}

// Re-export for convenience
export type { NotificationMessage as default };
