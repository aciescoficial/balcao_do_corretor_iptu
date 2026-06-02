
import React from 'react';
import { 
  Bell, 
  RefreshCcw,
  Check,
  X,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { NotificationMessage } from '@/components/layout/types/NotificationTypes';
import { getNotificationBgColor } from '@/components/layout/utils/notificationUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface NotificationItemProps {
  notification: NotificationMessage;
  onRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  
  const handleClick = () => {
    if (notification.action) {
      setShowDialog(true);
    }
    if (!notification.read) {
      onRead(notification.id);
    }
  };
  
  const handleActionClick = () => {
    setShowDialog(false);
    if (notification.action?.url) {
      window.location.href = notification.action.url;
    }
  };
  
  // Format date if available, otherwise use a placeholder
  const formattedDate = notification.createdAt 
    ? format(new Date(notification.createdAt), "d 'de' MMMM, HH:mm", { locale: ptBR })
    : "Recentemente";
  
  return (
    <>
      <DropdownMenuItem 
        className={cn(
          "flex flex-col items-start p-3 gap-1 cursor-pointer border-b last:border-b-0",
          notification.read ? "opacity-70" : "font-medium",
          notification.read ? "" : getNotificationBgColor(notification.type)
        )}
        onClick={handleClick}
      >
        <div className="flex justify-between w-full">
          <span className="text-sm">{notification.text}</span>
          {notification.read && (
            <Check className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
          )}
        </div>
        <div className="text-xs text-gray-500">{formattedDate}</div>
      </DropdownMenuItem>

      {notification.action && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Abrir link externo</DialogTitle>
              <DialogDescription>
                Você está sendo direcionado para um link externo: {notification.action.url}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleActionClick}>
                {notification.action.text}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

const EmptyNotifications: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
    <Bell className="h-8 w-8 mb-2 text-gray-400" />
    <p className="mb-1">Nenhuma notificação</p>
    <p className="text-xs">Você não tem notificações no momento.</p>
  </div>
);

const NotificationCenter: React.FC = () => {
  const { 
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotificationCenter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <DropdownMenuLabel className="py-0">Notificações</DropdownMenuLabel>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={markAllAsRead}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={refreshNotifications}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCcw className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
        
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onRead={markAsRead} 
              />
            ))
          )}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center p-2">
          <span className="text-sm text-center">Gerenciar configurações de notificações</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
