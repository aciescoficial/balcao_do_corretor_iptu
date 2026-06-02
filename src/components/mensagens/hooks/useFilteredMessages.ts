
import { useMemo } from 'react';
import { Message, MessagePriority } from './useMessages';

interface UseFilteredMessagesProps {
  messages: Message[];
  searchQuery: string;
  priorityFilter: MessagePriority | 'all';
}

export const useFilteredMessages = ({ 
  messages, 
  searchQuery, 
  priorityFilter 
}: UseFilteredMessagesProps) => {
  return useMemo(() => {
    return messages.filter(message => {
      const matchesSearch = searchQuery === '' || 
        message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });
  }, [messages, searchQuery, priorityFilter]);
};

export default useFilteredMessages;
