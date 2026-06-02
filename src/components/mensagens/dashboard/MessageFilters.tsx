
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessagePriority } from '../hooks/useMessages';

interface MessageFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: MessagePriority | 'all';
  setPriorityFilter: (priority: MessagePriority | 'all') => void;
}

const MessageFilters: React.FC<MessageFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter
}) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Buscar mensagens..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Prioridade
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filtrar por prioridade</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem 
            checked={priorityFilter === 'all'}
            onCheckedChange={() => setPriorityFilter('all')}
          >
            Todas
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={priorityFilter === 'normal'}
            onCheckedChange={() => setPriorityFilter('normal')}
          >
            Normal
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={priorityFilter === 'high'}
            onCheckedChange={() => setPriorityFilter('high')}
          >
            Alta
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={priorityFilter === 'urgent'}
            onCheckedChange={() => setPriorityFilter('urgent')}
          >
            Urgente
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MessageFilters;
