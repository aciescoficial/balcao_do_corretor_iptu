
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

interface ConnectionAlertProps {
  connectionStatus: boolean | null;
  error: Error | null;
  handleRefresh: () => void;
}

const ConnectionAlert: React.FC<ConnectionAlertProps> = ({ connectionStatus, error, handleRefresh }) => {
  if (connectionStatus === false) {
    return (
      <Alert variant="destructive" className="mb-4 animate-fade-in">
        <WifiOff className="h-4 w-4 mr-2" />
        <AlertTitle>Problema de conexão</AlertTitle>
        <AlertDescription>
          Não foi possível estabelecer conexão com o banco de dados. Verifique sua conexão com a internet e tente novamente.
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleRefresh}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 animate-fade-in">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Erro ao carregar usuários</AlertTitle>
        <AlertDescription>
          {error.message}
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleRefresh}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ConnectionAlert;
