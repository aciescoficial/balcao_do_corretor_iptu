
import React from 'react';
import { Link } from 'lucide-react';
import { NotificationMessage } from '../types/NotificationTypes';
import { getNotificationIcon } from '../utils/notificationUtils';

interface MessageContentProps {
  message: NotificationMessage;
  onActionClick: () => void;
}

const MessageContent: React.FC<MessageContentProps> = ({ message, onActionClick }) => {
  const Icon = getNotificationIcon(message.type);

  return (
    <div className="flex items-center justify-center flex-1 max-w-4xl">
      <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
      <p className="text-center text-sm">{message.text}</p>
      {message.action && (
        <button 
          onClick={onActionClick}
          className="ml-2 font-medium underline flex items-center text-sm"
        >
          {message.action.text}
          <Link className="h-3 w-3 ml-1" />
        </button>
      )}
    </div>
  );
};

export default MessageContent;
