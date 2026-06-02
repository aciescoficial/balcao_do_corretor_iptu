
import React from 'react';
import { CarteirinhaSolicitacao } from '../types';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreditCard, Mail, Pencil } from 'lucide-react';
import { StatusBadge, TrackingInfo } from './StatusBadge';
import { SolicitacaoEditDialog } from './SolicitacaoEditDialog';

interface SolicitacoesTableProps {
  solicitacoes: CarteirinhaSolicitacao[];
  isLoading: boolean;
  onEdit?: (solicitacao: CarteirinhaSolicitacao) => void;
  statusFilter?: string;
  onUpdate?: (id: string, data: Partial<CarteirinhaSolicitacao>) => Promise<boolean>;
  onRefresh?: () => void;
}

export const SolicitacoesTable: React.FC<SolicitacoesTableProps> = ({
  solicitacoes,
  isLoading,
  onEdit,
  statusFilter = '',
  onUpdate,
  onRefresh = () => {},
}) => {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Carregando dados...
              </TableCell>
            </TableRow>
          ) : solicitacoes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                {statusFilter ? (
                  <p>Nenhuma solicitação com este status foi encontrada.</p>
                ) : (
                  <p>Nenhuma solicitação de carteirinha encontrada.</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            solicitacoes.map((solicitacao) => (
              <TableRow key={solicitacao.id} className="hover:bg-muted/50">
                <TableCell>
                  <div>
                    <p className="font-medium">{`${solicitacao.nome} ${solicitacao.sobrenome}`}</p>
                    <p className="text-sm text-muted-foreground">{solicitacao.email}</p>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(solicitacao.valor)}</TableCell>
                <TableCell>
                  <StatusBadge status={solicitacao.status} />
                  {solicitacao.codigo_rastreio && (
                    <TrackingInfo code={solicitacao.codigo_rastreio} />
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(solicitacao.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-1 justify-end">
                    {onUpdate && onRefresh ? (
                      <SolicitacaoEditDialog 
                        solicitacao={solicitacao} 
                        onUpdate={onUpdate}
                        onSuccess={onRefresh}
                      />
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => onEdit && onEdit(solicitacao)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar Solicitação</span>
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Enviar E-mail</span>
                    </Button>
                    
                    <Button variant="ghost" size="icon">
                      <CreditCard className="h-4 w-4" />
                      <span className="sr-only">Gerar Carteirinha</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
