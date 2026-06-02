
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmpresaData } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface EmpresaResultsTableProps {
  results: EmpresaData[];
  isSearching?: boolean;
  locateEmpresa: (empresa: EmpresaData) => void;
  isMapEnabled: boolean;
}

const EmpresaResultsTable: React.FC<EmpresaResultsTableProps> = ({ 
  results, 
  isSearching = false,
  locateEmpresa, 
  isMapEnabled 
}) => {
  if (isSearching) {
    return (
      <div className="wp-card">
        <div className="flex justify-center py-8">
          <LoadingSpinner text="Buscando empresas..." />
        </div>
      </div>
    );
  }
  
  if (results.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="wp-badge-success">Ativo</span>;
      case 'pendente':
        return <span className="wp-badge-warning">Pendente</span>;
      case 'inativo':
        return <span className="wp-badge-error">Inativo</span>;
      default:
        return <span className="wp-badge">{status}</span>;
    }
  };

  return (
    <div className="wp-card">
      <h2 className="wp-subheader">Resultados da Busca</h2>
      <div className="overflow-x-auto">
        <table className="wp-table">
          <thead>
            <tr>
              <th>Nome Fantasia</th>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Nicho</th>
              <th>Cidade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td>{item.nome_fantasia}</td>
                <td>{item.razao_social}</td>
                <td>{item.cnpj}</td>
                <td>{item.nicho}</td>
                <td>{item.cidade}</td>
                <td>{getStatusBadge(item.status)}</td>
                <td>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => locateEmpresa(item)}
                      disabled={!isMapEnabled}
                    >
                      <MapPin size={12} />
                      Localizar
                    </Button>
                    <Button size="sm" variant="default">Editar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpresaResultsTable;
