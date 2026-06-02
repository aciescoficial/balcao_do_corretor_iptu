
import React, { useState } from 'react';
import { useMessages, MessagePriority } from './hooks/useMessages';
import { formatRelativeDate } from './utils/dateUtils';
import useFilteredMessages from './hooks/useFilteredMessages';

// Import our new components
import MessageHeader from './dashboard/MessageHeader';
import MessageFilters from './dashboard/MessageFilters';
import MessageTabs from './dashboard/MessageTabs';
import MessageCard from './dashboard/MessageCard';
import EmptyMessages from './dashboard/EmptyMessages';

const MessagesDashboard: React.FC = () => {
  const { 
    filter, 
    setFilter, 
    filteredMessages, 
    unreadCount, 
    readCount, 
    markAsRead, 
    markAllAsRead, 
    deleteMessage,
    fetchMessages,
    isFetching
  } = useMessages();

  // Local state for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<MessagePriority | 'all'>('all');
  
  // Get filtered messages based on search and priority
  const displayedMessages = useFilteredMessages({
    messages: filteredMessages,
    searchQuery,
    priorityFilter
  });

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <MessageHeader 
        unreadCount={unreadCount}
        markAllAsRead={markAllAsRead}
        fetchMessages={fetchMessages}
        isFetching={isFetching}
      />
      
      {/* Search and filter bar */}
      <MessageFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      
      {/* Message tabs and content */}
      <MessageTabs
        filter={filter}
        setFilter={setFilter}
        messagesCount={filteredMessages.length}
        unreadCount={unreadCount}
        readCount={readCount}
      >
        {displayedMessages.length > 0 ? (
          displayedMessages.map(message => (
            <MessageCard
              key={message.id}
              message={message}
              markAsRead={markAsRead}
              deleteMessage={deleteMessage}
              formatRelativeDate={formatRelativeDate}
            />
          ))
        ) : (
          <EmptyMessages 
            searchQuery={searchQuery}
            filter={filter}
          />
        )}
      </MessageTabs>
    </div>
  );
};

export default React.memo(MessagesDashboard);
