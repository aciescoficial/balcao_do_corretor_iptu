
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOperationLogs, OperationLog } from './services';
import { useAuth } from '@/components/auth';
import { OperationLogsTable } from './components/OperationLogsTable';
import { OperationLogsLoadingState } from './components/OperationLogsLoadingState';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const OperationLogs: React.FC = () => {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  const fetchLogs = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await getOperationLogs({});
      
      if (result.error) {
        setError(result.error);
        toast({
          title: 'Erro',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setLogs(result.logs);
        setCount(result.count);
      }
    } catch (error: any) {
      console.error('Erro ao buscar logs:', error);
      setError(error.message || 'Erro ao buscar logs');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de operações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, [isAdmin]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Histórico de Operações</h2>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchLogs}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <OperationLogsLoadingState 
        loading={loading} 
        isAdmin={isAdmin} 
        error={error} 
      />
      
      {!loading && isAdmin && !error && (
        logs.length > 0 ? (
          <OperationLogsTable logs={logs} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum registro de operação encontrado.
          </div>
        )
      )}
    </div>
  );
};
