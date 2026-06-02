
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import { Message, MessagePriority } from '../hooks/useMessages';
import { cn } from '@/lib/utils';

interface MessageCardProps {
  message: Message;
  markAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  formatRelativeDate: (dateString: string) => string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  markAsRead,
  deleteMessage,
  formatRelativeDate
}) => {
  // Get priority badge color
  const getPriorityBadge = (priority: MessagePriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
            <AlertCircle className="h-3 w-3" />
            Urgente
          </Badge>
        );
      case 'high':
        return <Badge variant="default" className="bg-amber-500">Alta</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <Card className={cn(
      "p-4 hover:bg-gray-50 transition-colors",
      !message.read && "border-l-4 border-l-blue-500",
      message.priority === 'urgent' && !message.read && "bg-red-50",
      message.priority === 'high' && !message.read && "bg-amber-50"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "text-lg font-semibold", 
              !message.read && "text-blue-700"
            )}>
              {message.title}
            </h3>
            {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
            {getPriorityBadge(message.priority)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            De: {message.sender} • {formatRelativeDate(message.date)}
          </p>
          <p className="mt-3">{message.content}</p>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          {!message.read && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => markAsRead(message.id)}
            >
              <BookmarkCheck className="h-4 w-4" />
              <span>Marcar como lida</span>
            </Button>
          )}
          <Button variant="ghost" size="sm">Ver detalhes</Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
            onClick={() => deleteMessage(message.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Excluir</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessageCard;
