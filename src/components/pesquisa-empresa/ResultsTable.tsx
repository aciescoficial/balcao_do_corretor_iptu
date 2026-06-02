
import React from 'react';
import { MapPin } from 'lucide-react';
import { EmpresaData } from './types';
import StatusBadge from './StatusBadge';

interface ResultsTableProps {
  results: EmpresaData[];
  locateEmpresa: (empresa: EmpresaData) => void;
  isLoaded: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, locateEmpresa, isLoaded }) => {
  if (results.length === 0) {
    return null;
  }

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
                <td><StatusBadge status={item.status} /></td>
                <td>
                  <div className="flex space-x-2">
                    <button 
                      className="wp-button-secondary text-xs py-1 px-2 flex items-center gap-1"
                      onClick={() => locateEmpresa(item)}
                      disabled={!isLoaded}
                    >
                      <MapPin size={12} />
                      Localizar
                    </button>
                    <button className="wp-button text-xs py-1 px-2">Editar</button>
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

export default ResultsTable;
