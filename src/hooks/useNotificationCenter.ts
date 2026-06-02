
import { useState, useCallback } from 'react';
import { NotificationMessage } from '@/components/layout/types/NotificationTypes';
import { useHeaderNotifications } from './useHeaderNotifications';
import { toast } from '@/components/ui/use-toast';

export function useNotificationCenter() {
  const { 
    importantMessages, 
    isLoading, 
    hasError, 
    refreshMessages 
  } = useHeaderNotifications({
    debug: process.env.NODE_ENV === 'development'
  });
  
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    // Load read notification IDs from localStorage on init
    const savedIds = localStorage.getItem('readNotifications');
    return savedIds ? JSON.parse(savedIds) : [];
  });
  
  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setReadNotificationIds(prev => {
      const newIds = [...prev, id];
      // Save to localStorage for persistence
      localStorage.setItem('readNotifications', JSON.stringify(newIds));
      return newIds;
    });
  }, []);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const allIds = importantMessages.map(msg => msg.id);
    setReadNotificationIds(prev => {
      const newIds = [...new Set([...prev, ...allIds])];
      localStorage.setItem('readNotifications', JSON.stringify(newIds));
      return newIds;
    });
    
    if (allIds.length > 0) {
      toast({
        title: "Todas notificações lidas",
        description: `${allIds.length} notificações foram marcadas como lidas.`
      });
    }
  }, [importantMessages]);
  
  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    refreshMessages();
    toast({
      title: "Atualizando notificações",
      description: "Buscando novas notificações..."
    });
  }, [refreshMessages]);
  
  // Apply read status to notifications
  const notificationsWithReadStatus = importantMessages.map(notification => ({
    ...notification,
    read: readNotificationIds.includes(notification.id)
  }));
  
  // Count unread notifications
  const unreadCount = notificationsWithReadStatus.filter(n => !n.read).length;
  
  return {
    notifications: notificationsWithReadStatus,
    unreadCount,
    isLoading,
    hasError,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  };
}
