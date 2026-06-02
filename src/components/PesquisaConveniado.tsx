
import React from 'react';
import { useConveniadoSearch } from './conveniado/hooks/useConveniadoSearch';
import ConveniadoSearchForm from './conveniado/components/ConveniadoSearchForm';
import ConveniadoSearchResults from './conveniado/components/ConveniadoSearchResults';

const PesquisaConveniado: React.FC = () => {
  const {
    conveniados,
    loading,
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    statusFilter,
    setStatusFilter,
    cidadeFilter,
    setCidadeFilter,
    cidades,
    currentPage,
    setCurrentPage,
    totalCount,
    itemsPerPage,
    setItemsPerPage,
    handleSearch,
    fetchConveniados
  } = useConveniadoSearch();

  // Calculate pagination values
  const totalPages = itemsPerPage > 0 ? Math.ceil(totalCount / itemsPerPage) : 1;
  const showResults = conveniados.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Pesquisar Conveniados</h1>
      
      <div className="wp-card">
        <ConveniadoSearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          setSearchType={setSearchType}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          cidadeFilter={cidadeFilter}
          setCidadeFilter={setCidadeFilter}
          cidades={cidades}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          handleSearch={handleSearch}
          fetchConveniados={fetchConveniados}
          loading={loading}
        />
      </div>
      
      <ConveniadoSearchResults 
        conveniados={conveniados}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        showResults={showResults}
      />
    </div>
  );
};

export default PesquisaConveniado;
