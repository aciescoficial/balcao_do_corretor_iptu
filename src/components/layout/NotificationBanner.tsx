
import React, { memo } from 'react';
import { NotificationMessage } from './types/NotificationTypes';
import { useNotificationBanner } from '@/hooks/useNotificationBanner';
import { getNotificationBgColor } from './utils/notificationUtils';
import MessageContent from './notifications/MessageContent';
import NotificationControls from './notifications/NotificationControls';

interface NotificationBannerProps {
  messages?: NotificationMessage[];
}

// Using memo to prevent unnecessary re-renders
const NotificationBanner: React.FC<NotificationBannerProps> = memo(({ messages = [] }) => {
  const {
    currentMessage,
    activeMessages,
    currentMessageIndex,
    showSystemMessages,
    hasError,
    handleActionClick,
    dismissMessage,
    nextMessage
  } = useNotificationBanner(messages);
  
  // If system messages are disabled or there are no valid messages, don't render the banner
  if (!showSystemMessages || activeMessages.length === 0) {
    return null;
  }
  
  // Safety check - if currentMessage is undefined or invalid, don't render anything
  if (!currentMessage || !currentMessage.type) {
    return null;
  }
  
  try {
    return (
      <div className={`w-full ${getNotificationBgColor(currentMessage.type)} py-2 px-4 flex items-center justify-center relative transition-all`}>
        {/* Message content */}
        <MessageContent 
          message={currentMessage} 
          onActionClick={handleActionClick} 
        />
        
        {/* Navigation and dismiss controls */}
        <NotificationControls
          totalMessages={activeMessages.length}
          currentIndex={currentMessageIndex}
          onDismiss={dismissMessage}
          onNext={nextMessage}
        />
      </div>
    );
  } catch (error) {
    console.error("Error rendering NotificationBanner:", error);
    return null;
  }
});

// Add display name for memo component
NotificationBanner.displayName = 'NotificationBanner';

export default NotificationBanner;
export type { NotificationMessage };
