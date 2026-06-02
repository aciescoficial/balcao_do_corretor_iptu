
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmptyMessagesProps {
  searchQuery: string;
  filter: 'all' | 'unread' | 'read';
}

const EmptyMessages: React.FC<EmptyMessagesProps> = ({ searchQuery, filter }) => {
  return (
    <div className="text-center p-8 border rounded-md bg-gray-50 flex flex-col items-center">
      <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-gray-500">
        {searchQuery 
          ? 'Nenhuma mensagem encontrada para esta busca' 
          : filter === 'all' 
            ? 'Nenhuma mensagem encontrada'
            : filter === 'unread' 
              ? 'Nenhuma mensagem não lida'
              : 'Nenhuma mensagem lida'
        }
      </p>
    </div>
  );
};

export default EmptyMessages;
