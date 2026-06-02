
import React from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface EmptySearchResultsProps {
  isSearching: boolean;
}

const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({ isSearching }) => {
  if (isSearching) {
    return (
      <div className="mt-8 text-center">
        <LoadingSpinner size="medium" text="Buscando associados..." />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="text-center p-12 text-gray-500">
        Use os filtros acima para buscar associados
      </div>
    </div>
  );
};

export default EmptySearchResults;
