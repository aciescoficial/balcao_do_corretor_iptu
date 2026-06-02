
import { useMemo, useEffect } from 'react';
import { HeaderNotificationsOptions, NotificationsState } from '@/components/layout/types/NotificationTypes';
import { useSystemConfig } from './notifications/useSystemConfig';
import { useNotificationFetcher } from './notifications/useNotificationFetcher';
import { getCacheStatus } from './notifications/notificationUtils';

const DEFAULT_OPTIONS: HeaderNotificationsOptions = {
  cacheDuration: 5 * 60 * 1000, // 5 minutes default
  enableRetry: true,
  maxRetries: 3,
  debug: false,
};

export function useHeaderNotifications(options: HeaderNotificationsOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // Get system configuration (whether to show messages)
  const { showSystemMessages } = useSystemConfig(config.debug);
  
  // Use our notification fetcher to handle message loading and caching
  const { 
    messages,
    isLoading,
    hasError,
    errorMessage,
    lastFetched,
    fetchMessages,
    refreshMessages
  } = useNotificationFetcher({
    cacheDuration: config.cacheDuration,
    enableRetry: config.enableRetry,
    maxRetries: config.maxRetries,
    debug: config.debug
  });
  
  // Memoize the state to avoid unnecessary renders
  const state: NotificationsState = useMemo(() => ({
    importantMessages: showSystemMessages ? messages : [],
    isLoading,
    hasError,
    errorMessage,
    lastFetched,
    showSystemMessages
  }), [messages, isLoading, hasError, errorMessage, lastFetched, showSystemMessages]);
  
  // Cache status calculation
  const cacheStatus = useMemo(() => {
    return getCacheStatus(lastFetched, config.cacheDuration).status;
  }, [lastFetched, config.cacheDuration]);
  
  useEffect(() => {
    if (showSystemMessages) {
      // Use a larger delay on initial load to prioritize other UI components
      const initialLoadTimer = setTimeout(() => {
        fetchMessages();
      }, 2000);
      
      // Update messages every 10 minutes
      const interval = setInterval(() => {
        fetchMessages();
      }, 10 * 60 * 1000);
      
      return () => {
        clearTimeout(initialLoadTimer);
        clearInterval(interval);
      };
    }
  }, [showSystemMessages, fetchMessages]);

  return {
    importantMessages: state.importantMessages,
    isLoading: state.isLoading,
    hasError: state.hasError,
    errorMessage: state.errorMessage,
    lastFetched: state.lastFetched,
    refreshMessages,
    cacheStatus
  };
}
