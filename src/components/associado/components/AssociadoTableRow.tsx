
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Clock, Edit } from 'lucide-react';
import { AssociadoListItem } from '../hooks/useAssociadosList';
import { useNavigate } from 'react-router-dom';

interface AssociadoTableRowProps {
  associado: AssociadoListItem;
}

const AssociadoTableRow: React.FC<AssociadoTableRowProps> = ({ associado }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
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

  const handleEdit = () => {
    navigate(`/associados/editar/${associado.id}`);
  };

  return (
    <TableRow>
      <TableCell>{associado.nome}</TableCell>
      <TableCell>{associado.sobrenome}</TableCell>
      <TableCell>{associado.creci || '-'}</TableCell>
      <TableCell>{associado.rg || '-'}</TableCell>
      <TableCell>{associado.email}</TableCell>
      <TableCell>
        {getStatusBadge(associado.status)}
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleEdit}
          className="hover:bg-muted"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AssociadoTableRow;
