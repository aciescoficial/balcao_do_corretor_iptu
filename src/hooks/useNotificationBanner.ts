
import { useState, useEffect } from 'react';
import { NotificationMessage } from '@/components/layout/types/NotificationTypes';

export function useNotificationBanner(messages: NotificationMessage[] = []) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dismissedMessages, setDismissedMessages] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [showSystemMessages, setShowSystemMessages] = useState(true);

  // Load system configuration
  useEffect(() => {
    // Try to get config from localStorage first (for immediate effect after changes)
    const loadSystemConfig = () => {
      try {
        const storedConfig = localStorage.getItem('systemConfig');
        if (storedConfig) {
          const config = JSON.parse(storedConfig);
          setShowSystemMessages(config.showSystemMessages ?? true);
        }
      } catch (error) {
        console.error('Error parsing system config from localStorage:', error);
      }
    };

    // Initial load
    loadSystemConfig();

    // Listen for config updates
    const handleConfigUpdate = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.showSystemMessages === 'boolean') {
        setShowSystemMessages(event.detail.showSystemMessages);
      }
    };

    window.addEventListener('system-config-updated', handleConfigUpdate as EventListener);

    return () => {
      window.removeEventListener('system-config-updated', handleConfigUpdate as EventListener);
    };
  }, []);
  
  // Validate messages to ensure they have required properties
  useEffect(() => {
    try {
      if (!Array.isArray(messages)) {
        console.error("NotificationBanner: messages is not an array", messages);
        setHasError(true);
        return;
      }
      
      const invalidMessages = messages.filter(msg => !msg?.id || !msg?.text);
      if (invalidMessages.length > 0) {
        console.error("NotificationBanner: invalid message format", invalidMessages);
        setHasError(true);
      } else {
        setHasError(false);
      }
    } catch (error) {
      console.error("NotificationBanner: error validating messages", error);
      setHasError(true);
    }
  }, [messages]);
  
  // Filter out dismissed messages
  const activeMessages = !hasError ? 
    messages.filter(msg => msg && !dismissedMessages.includes(msg.id)) : [];
  
  // Display only the current message with safety checks
  const currentMessage = activeMessages[currentMessageIndex];
  
  const handleActionClick = () => {
    if (currentMessage?.action && currentMessage.action.url) {
      window.location.href = currentMessage.action.url;
    }
  };
  
  const dismissMessage = () => {
    if (!currentMessage) return;
    
    setDismissedMessages(prev => [...prev, currentMessage.id]);
    
    // If there are more messages, go to the next one
    if (currentMessageIndex < activeMessages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    }
  };
  
  // Navigate to next message if there are multiple
  const nextMessage = () => {
    if (currentMessageIndex < activeMessages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      setCurrentMessageIndex(0); // Loop back to first message
    }
  };

  return {
    currentMessage,
    activeMessages,
    currentMessageIndex,
    showSystemMessages,
    hasError,
    handleActionClick,
    dismissMessage,
    nextMessage
  };
}
