
import React from 'react';
import ConveniadoResultsTable from './ConveniadoResultsTable';
import ConveniadoPagination from './ConveniadoPagination';
import { Conveniado } from '../hooks/useConveniadoSearch';

interface ConveniadoSearchResultsProps {
  conveniados: Conveniado[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  showResults: boolean;
}

const ConveniadoSearchResults: React.FC<ConveniadoSearchResultsProps> = ({
  conveniados,
  loading,
  currentPage,
  totalPages,
  setCurrentPage,
  showResults
}) => {
  if (!showResults) return null;
  
  return (
    <div className="wp-card">
      <h2 className="wp-subheader">Resultados da Busca</h2>
      <ConveniadoResultsTable
        conveniados={conveniados}
        loading={loading}
      />
      <ConveniadoPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ConveniadoSearchResults;
