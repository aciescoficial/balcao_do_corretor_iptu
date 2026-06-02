
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NotificationMessage } from '@/components/layout/types/NotificationTypes';
import { toast } from '@/components/ui/use-toast';
import {
  saveMessagesToCache,
  loadMessagesFromCache,
  formatApiMessagesToNotifications,
  loadDemoMessages
} from './notificationUtils';

interface FetcherOptions {
  cacheDuration?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  debug?: boolean;
}

interface FetcherState {
  messages: NotificationMessage[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastFetched?: number;
}

export function useNotificationFetcher(options: FetcherOptions = {}) {
  const { cacheDuration = 5 * 60 * 1000, enableRetry = true, maxRetries = 3, debug = false } = options;
  
  const [state, setState] = useState<FetcherState>({
    messages: [],
    isLoading: false,
    hasError: false
  });

  // Debug logger function
  const logDebug = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[useNotificationFetcher] ${message}`, data || '');
    }
  }, [debug]);

  // Function to fetch important messages with improved performance
  const fetchMessages = useCallback(async (retryCount = 0) => {
    // Check if we're already loading data to prevent duplicate requests
    if (state.isLoading) {
      logDebug('Fetch already in progress, skipping');
      return;
    }
    
    // Try to load from cache first
    const cachedData = loadMessagesFromCache(cacheDuration, logDebug);
    if (cachedData) {
      setState(prev => ({
        ...prev,
        messages: cachedData.messages,
        lastFetched: cachedData.timestamp
      }));
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true }));
    logDebug('Fetching messages from API');
    
    try {
      // Using the email_templates table as a temporary solution
      // Set a timeout to abort if the query takes too long
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Query timeout")), 8000);
      });
      
      // Use a simpler query to reduce database load
      const queryPromise = supabase
        .from('email_templates')
        .select('id, assunto, corpo, codigo, created_at')
        .eq('codigo', 'sistema_alerta')
        .limit(5);
        
      // Race between the query and timeout
      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise.then(() => ({ data: null, error: new Error("Query timeout") }))
      ]) as any;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Format messages from the email_templates table
        const formattedMessages = formatApiMessagesToNotifications(data);
        
        setState(prev => ({ 
          ...prev, 
          messages: formattedMessages, 
          hasError: false,
          isLoading: false,
          errorMessage: undefined,
          lastFetched: Date.now()
        }));
        
        // Cache the messages
        saveMessagesToCache(formattedMessages, logDebug);
      } else {
        // When testing locally, if no messages in the database, use demo messages
        const demoMessages = loadDemoMessages();
        
        if (demoMessages) {
          setState(prev => ({ 
            ...prev, 
            messages: demoMessages,
            isLoading: false,
            lastFetched: Date.now()
          }));
          saveMessagesToCache(demoMessages, logDebug);
        } else {
          setState(prev => ({ ...prev, messages: [], isLoading: false }));
        }
      }
    } catch (error) {
      console.error("Error fetching important messages:", error);
      
      // Implement retry logic
      if (enableRetry && retryCount < maxRetries) {
        logDebug(`Retry attempt ${retryCount + 1} of ${maxRetries}`);
        
        setTimeout(() => {
          fetchMessages(retryCount + 1);
        }, 2000 * Math.pow(2, retryCount)); // Exponential backoff
        
        return;
      }
      
      setState(prev => ({ 
        ...prev, 
        hasError: true,
        isLoading: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error fetching messages'
      }));
      
      // On error, try to use cached messages
      const cachedData = loadMessagesFromCache(Infinity, logDebug); // Use infinite cache duration to get even stale data
      
      if (cachedData) {
        setState(prev => ({ 
          ...prev, 
          messages: cachedData.messages,
          hasError: true, // Still set hasError true to indicate we're using stale data
          errorMessage: 'Using cached data due to fetch error',
        }));
        
        // Show error toast but still display cached data
        toast({
          title: "Notification Error",
          description: "Using cached notifications. Some information may be outdated.",
          variant: "destructive"
        });
      } else {
        // Try demo messages as last resort
        const demoMessages = loadDemoMessages();
        
        if (demoMessages) {
          setState(prev => ({ 
            ...prev, 
            messages: demoMessages,
            hasError: true
          }));
        }
      }
    }
  }, [state.isLoading, cacheDuration, enableRetry, maxRetries, logDebug]);
  
  // Force refresh function for manual refresh
  const refreshMessages = useCallback(() => {
    // Clear cache and force fetch
    localStorage.removeItem('cachedSystemMessages');
    localStorage.removeItem('cachedSystemMessagesTimestamp');
    fetchMessages();
    logDebug('Manually refreshing messages');
  }, [fetchMessages, logDebug]);

  return {
    ...state,
    fetchMessages,
    refreshMessages
  };
}
