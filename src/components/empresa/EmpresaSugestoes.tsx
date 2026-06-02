
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSugestoes } from './sugestoes/useSugestoes';
import SugestoesTable from './sugestoes/SugestoesTable';
import SugestoesSearchControls from './sugestoes/SugestoesSearchControls';
import SugestoesPagination from './sugestoes/SugestoesPagination';

const EmpresaSugestoes: React.FC = () => {
  const {
    searchTerm,
    selectedDate,
    currentPage,
    currentItems,
    filteredSugestoes,
    totalPages,
    handleSearch,
    setSelectedDate,
    setCurrentPage
  } = useSugestoes();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">{filteredSugestoes.length} Sugestões de Empresas</h1>
      </div>

      <SugestoesSearchControls 
        searchTerm={searchTerm}
        selectedDate={selectedDate}
        handleSearch={handleSearch}
        setSelectedDate={setSelectedDate}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <SugestoesTable currentItems={currentItems} />
          </div>
        </CardContent>
      </Card>

      {filteredSugestoes.length > 0 && (
        <div className="flex justify-center mt-6">
          <SugestoesPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default EmpresaSugestoes;
