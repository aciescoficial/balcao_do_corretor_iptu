import React from 'react';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Conveniado, ConveniadoStatus } from '../hooks/useConveniadoSearch';

interface ConveniadoResultsTableProps {
  conveniados: Conveniado[];
  loading: boolean;
}

const ConveniadoResultsTable: React.FC<ConveniadoResultsTableProps> = ({ 
  conveniados, 
  loading 
}) => {
  const getStatusBadge = (status: ConveniadoStatus) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><UserCheck className="h-3 w-3 mr-1" />Ativo</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'inativo':
        return <Badge variant="destructive"><UserX className="h-3 w-3 mr-1" />Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border overflow-auto max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>CRECI</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <LoadingSpinner size="medium" />
              </TableCell>
            </TableRow>
          ) : conveniados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Nenhum conveniado encontrado.
              </TableCell>
            </TableRow>
          ) : (
            conveniados.map((conveniado) => (
              <TableRow key={conveniado.id}>
                <TableCell className="font-medium">
                  {conveniado.nome} {conveniado.sobrenome}
                </TableCell>
                <TableCell>{conveniado.cpf}</TableCell>
                <TableCell>{conveniado.cidade}</TableCell>
                <TableCell>{conveniado.creci || "-"}</TableCell>
                <TableCell className="text-sm">
                  <div>{conveniado.email}</div>
                  <div>{conveniado.telefone}</div>
                </TableCell>
                <TableCell>{getStatusBadge(conveniado.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Ver</Button>
                    <Button size="sm">Editar</Button>
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

export default ConveniadoResultsTable;
