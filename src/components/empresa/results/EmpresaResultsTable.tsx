
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, ExternalLink } from 'lucide-react';
import { EmpresaData } from '../types';

interface EmpresaResultsTableProps {
  results: EmpresaData[];
  locateEmpresa: (empresa: EmpresaData) => void;
  isMapEnabled: boolean;
}

const EmpresaResultsTable: React.FC<EmpresaResultsTableProps> = ({
  results,
  locateEmpresa,
  isMapEnabled
}) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">Resultados da Busca ({results.length})</h2>
        
        <div className="overflow-x-auto">
          <table className="wp-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Cidade</th>
                <th>Nicho</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {results.map((empresa) => (
                <tr key={empresa.id}>
                  <td>
                    <div>
                      <div className="font-medium">{empresa.nome_fantasia}</div>
                      <div className="text-xs text-gray-500">{empresa.razao_social}</div>
                    </div>
                  </td>
                  <td>{empresa.cidade}</td>
                  <td>
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {empresa.nicho}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone size={14} className="text-gray-500" />
                      <a 
                        href={`tel:${empresa.telefone}`} 
                        className="hover:underline"
                      >
                        {empresa.telefone}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      {isMapEnabled && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => locateEmpresa(empresa)}
                          title="Ver no mapa"
                        >
                          <MapPin size={14} className="mr-1" />
                          Mapa
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        title="Ver mais detalhes"
                      >
                        <a href={`/empresas/${empresa.id}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={14} className="mr-1" />
                          Detalhes
                        </a>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmpresaResultsTable;
