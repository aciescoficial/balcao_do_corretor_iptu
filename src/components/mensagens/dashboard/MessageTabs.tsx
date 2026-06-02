
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageStatus } from '../hooks/useMessages';

interface MessageTabsProps {
  filter: MessageStatus;
  setFilter: (filter: MessageStatus) => void;
  messagesCount: number;
  unreadCount: number;
  readCount: number;
  children: React.ReactNode;
}

const MessageTabs: React.FC<MessageTabsProps> = ({
  filter,
  setFilter,
  messagesCount,
  unreadCount,
  readCount,
  children
}) => {
  return (
    <Tabs defaultValue={filter} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all" onClick={() => setFilter('all')}>
          Todas ({messagesCount})
        </TabsTrigger>
        <TabsTrigger value="unread" onClick={() => setFilter('unread')}>
          Não Lidas ({unreadCount})
        </TabsTrigger>
        <TabsTrigger value="read" onClick={() => setFilter('read')}>
          Lidas ({readCount})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={filter} className="space-y-4">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default MessageTabs;
