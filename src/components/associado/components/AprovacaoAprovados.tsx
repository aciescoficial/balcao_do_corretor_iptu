
import React from 'react';
import { useAprovacaoInteresse } from '../hooks/useAprovacaoInteresse';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

const AprovacaoAprovados = () => {
  const { interesses, isLoading, statusFilter, setStatusFilter } = useAprovacaoInteresse();
  
  React.useEffect(() => {
    // Set the filter to 'aprovado' when this component mounts
    setStatusFilter('aprovado');
  }, [setStatusFilter]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {interesses.map((interessado) => (
        <Card key={interessado.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{interessado.nome} {interessado.sobrenome}</h3>
              <p className="text-sm text-muted-foreground">{interessado.email}</p>
              <p className="text-sm text-muted-foreground">{interessado.cidade}/{interessado.estado}</p>
            </div>
            <Badge variant="secondary">
              {format(new Date(interessado.created_at), 'dd/MM/yyyy')}
            </Badge>
          </div>
        </Card>
      ))}
      
      {interesses.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum interessado aprovado encontrado.
        </div>
      )}
    </div>
  );
};

export default AprovacaoAprovados;
