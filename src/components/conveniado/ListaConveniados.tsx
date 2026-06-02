
import React from 'react';
import { useConveniadoSearch } from './hooks/useConveniadoSearch';
import ConveniadoSearchForm from './components/ConveniadoSearchForm';
import ConveniadoResultsTable from './components/ConveniadoResultsTable';
import ConveniadoPagination from './components/ConveniadoPagination';

const ListaConveniados: React.FC = () => {
  const {
    conveniados,
    loading,
    searchTerm,
    setSearchTerm,
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

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Lista de Conveniados</h1>
      
      <div className="wp-card">
        <ConveniadoSearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
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
        
        <ConveniadoResultsTable
          conveniados={conveniados}
          loading={loading}
        />
        
        <ConveniadoPagination
          currentPage={currentPage}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ListaConveniados;
