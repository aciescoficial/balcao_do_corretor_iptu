
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMessages } from '../hooks/useMessages';

const MensagensHeader: React.FC = () => {
  const { fetchMessages, isFetching } = useMessages();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="wp-header">Sistema de Mensagens</h1>
      <div>
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
      </div>
    </div>
  );
};

export default MensagensHeader;
