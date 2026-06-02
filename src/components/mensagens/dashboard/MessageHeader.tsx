
import React from 'react';
import { Link } from 'react-router-dom';
import { Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MessageHeaderProps {
  unreadCount: number;
  markAllAsRead: () => void;
  fetchMessages: () => void;
  isFetching: boolean;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ 
  unreadCount, 
  markAllAsRead, 
  fetchMessages,
  isFetching
}) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="wp-header">
        Mensagens Recebidas
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-2 text-xs">
            {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
          </Badge>
        )}
      </h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMessages}
          disabled={isFetching}
          className="hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Atualizando...' : 'Atualizar'}
        </Button>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
          >
            Marcar todas como lidas
          </Button>
        )}
        <Button asChild>
          <Link to="/mensagens/enviar" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviar Nova Mensagem
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MessageHeader;
