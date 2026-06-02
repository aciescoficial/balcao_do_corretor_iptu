
import { NotificationMessage, NotificationCacheStatus } from '@/components/layout/types/NotificationTypes';

// Cache configuration
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Debug logger function for notifications
 */
export function createDebugLogger(isDebugEnabled: boolean) {
  return (message: string, data?: any) => {
    if (isDebugEnabled) {
      console.log(`[useHeaderNotifications] ${message}`, data || '');
    }
  };
}

/**
 * Check if cached data is still valid based on timestamp and duration
 */
export function isCacheValid(timestamp: number | undefined, cacheDuration: number = DEFAULT_CACHE_DURATION): boolean {
  if (!timestamp || !cacheDuration) return false;
  return (Date.now() - timestamp) < cacheDuration;
}

/**
 * Get cache status with more details
 */
export function getCacheStatus(timestamp?: number, cacheDuration?: number): NotificationCacheStatus {
  if (!timestamp) {
    return { status: 'none' };
  }
  
  return {
    status: isCacheValid(timestamp, cacheDuration) ? 'valid' : 'expired',
    timestamp
  };
}

/**
 * Save messages to local storage cache
 */
export function saveMessagesToCache(messages: NotificationMessage[], logDebug: (message: string, data?: any) => void): void {
  try {
    localStorage.setItem('cachedSystemMessages', JSON.stringify(messages));
    localStorage.setItem('cachedSystemMessagesTimestamp', Date.now().toString());
    logDebug('Messages saved to cache', { messageCount: messages.length });
  } catch (e) {
    console.error('Error saving messages to cache:', e);
  }
}

/**
 * Load messages from local storage cache
 * Returns null if no valid cache found
 */
export function loadMessagesFromCache(
  cacheDuration: number | undefined, 
  logDebug: (message: string, data?: any) => void
): { messages: NotificationMessage[], timestamp: number } | null {
  try {
    const cachedMessages = localStorage.getItem('cachedSystemMessages');
    const cacheTimestamp = localStorage.getItem('cachedSystemMessagesTimestamp');
    
    if (cachedMessages && cacheTimestamp) {
      const timestamp = parseInt(cacheTimestamp, 10);
      
      if (isCacheValid(timestamp, cacheDuration)) {
        const parsedMessages = JSON.parse(cachedMessages);
        if (Array.isArray(parsedMessages)) {
          logDebug('Using cached messages', { messageCount: parsedMessages.length });
          return { messages: parsedMessages, timestamp };
        }
      } else {
        logDebug('Cache expired', { timestamp, now: Date.now(), diff: Date.now() - timestamp });
      }
    }
    return null;
  } catch (e) {
    console.error('Error loading messages from cache:', e);
    return null;
  }
}

/**
 * Clear notification cache
 */
export function clearNotificationCache(): void {
  localStorage.removeItem('cachedSystemMessages');
  localStorage.removeItem('cachedSystemMessagesTimestamp');
}

/**
 * Format messages from API data
 */
export function formatApiMessagesToNotifications(data: any[]): NotificationMessage[] {
  return data.map((template: any) => ({
    id: template.id || String(Math.random()),
    text: template.assunto || 'Notificação do sistema',
    type: 'info' as const,
    createdAt: template.created_at || new Date().toISOString(),
    action: template.corpo && template.corpo.includes('http') ? {
      url: template.corpo.match(/https?:\/\/[^\s]+/)?.[0] || '#',
      text: 'Saiba mais'
    } : undefined
  }));
}

/**
 * Load demo messages for development and testing
 */
export function loadDemoMessages(): NotificationMessage[] | null {
  // Create demo messages with timestamps for testing
  const now = new Date();
  const demoMessages: NotificationMessage[] = [
    {
      id: '1',
      text: 'Bem-vindo ao sistema! Clique aqui para um tour guiado.',
      type: 'info',
      createdAt: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 minutes ago
      action: {
        url: '#tour',
        text: 'Iniciar tour'
      }
    },
    {
      id: '2',
      text: 'Existem 3 novas empresas aguardando aprovação.',
      type: 'event',
      createdAt: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
      action: {
        url: '/aprovacoes-pendentes',
        text: 'Visualizar'
      }
    },
    {
      id: '3',
      text: 'Pagamento confirmado para carteirinha #12345.',
      type: 'payment',
      createdAt: new Date(now.getTime() - 24 * 3600000).toISOString(), // 1 day ago
      action: {
        url: '/financeiro',
        text: 'Ver detalhes'
      }
    },
    {
      id: '4',
      text: 'Seu plano de associação vence em 7 dias.',
      type: 'inactive',
      createdAt: new Date(now.getTime() - 3 * 24 * 3600000).toISOString(), // 3 days ago
      action: {
        url: '/renovar',
        text: 'Renovar agora'
      }
    }
  ];

  // Also check if there are stored demo messages
  const storedMessages = window.localStorage.getItem('demoMessages');
  if (storedMessages) {
    try {
      const parsedMessages = JSON.parse(storedMessages);
      if (Array.isArray(parsedMessages)) {
        return parsedMessages;
      }
    } catch (e) {
      console.error("Error parsing demo messages:", e);
    }
  }
  
  // Save the demo messages in localStorage for persistence
  localStorage.setItem('demoMessages', JSON.stringify(demoMessages));
  return demoMessages;
}
