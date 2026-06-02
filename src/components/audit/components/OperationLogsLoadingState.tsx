
import React from 'react';
import { ShieldAlert, UserX } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface OperationLogsLoadingStateProps {
  loading: boolean;
  isAdmin: boolean;
  error?: string | null;
}

export const OperationLogsLoadingState: React.FC<OperationLogsLoadingStateProps> = ({ 
  loading, 
  isAdmin,
  error 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!isAdmin) {
    return (
      <Alert>
        <UserX className="h-4 w-4" />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Você não tem permissão para visualizar os logs de operações. Somente administradores podem acessar esta funcionalidade.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
