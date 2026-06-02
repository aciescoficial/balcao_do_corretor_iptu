
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PendenteData } from '../types';

interface PendingTableProps {
  pendentes: PendenteData[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  getTipoBadge: (tipo: string) => React.ReactNode;
}

export const PendingTable: React.FC<PendingTableProps> = ({ 
  pendentes, 
  onApprove, 
  onReject, 
  getTipoBadge 
}) => (
  <div className="overflow-x-auto">
    <table className="wp-table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Nome</th>
          <th>CNPJ</th>
          <th>Data do Cadastro</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {pendentes.length === 0 ? (
          <tr>
            <td colSpan={7} className="h-24 text-center text-muted-foreground">
              Nenhuma aprovação pendente encontrada.
            </td>
          </tr>
        ) : (
          pendentes.map((item) => (
            <tr key={item.id}>
              <td>{getTipoBadge(item.tipo)}</td>
              <td>{item.nome}</td>
              <td>{item.documento}</td>
              <td>{item.dataCadastro}</td>
              <td>{item.email}</td>
              <td>{item.telefone}</td>
              <td>
                <div className="flex space-x-2">
                  <Button 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onApprove(item.id)}
                  >
                    <Check size={14} />
                    Aprovar
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => onReject(item.id)}
                  >
                    <X size={14} />
                    Rejeitar
                  </Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
