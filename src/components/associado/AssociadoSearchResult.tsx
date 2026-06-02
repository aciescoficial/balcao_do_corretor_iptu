
import React from 'react';
import AssociadoCard from './AssociadoCard';
import AssociadoPagination from './AssociadoPagination';
import EmptySearchResults from './EmptySearchResults';
import { Associado } from './types';

interface AssociadoSearchResultProps {
  results: Associado[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
  itemsPerPage: number;
  isSearching: boolean;
}

const AssociadoSearchResult: React.FC<AssociadoSearchResultProps> = ({ 
  results, 
  currentPage, 
  setCurrentPage, 
  totalCount, 
  itemsPerPage,
  isSearching 
}) => {
  if (isSearching || results.length === 0) {
    return <EmptySearchResults isSearching={isSearching} />;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Resultados da Busca</h2>
        <span className="text-sm text-gray-500">
          Mostrando {results.length} de {totalCount} associados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((associado) => (
          <AssociadoCard key={associado.id} associado={associado} />
        ))}
      </div>

      <AssociadoPagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default AssociadoSearchResult;
