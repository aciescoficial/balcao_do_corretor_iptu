
import React from 'react';
import { useAssociadosList } from './hooks/useAssociadosList';
import AssociadoSearchForm from './components/AssociadoSearchForm';
import AssociadosTable from './components/AssociadosTable';
import AssociadosPagination from './components/AssociadosPagination';

const ListaAssociados: React.FC = () => {
  const {
    associados,
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
    fetchAssociados
  } = useAssociadosList();

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Lista de Associados</h1>
      
      <div className="wp-card">
        <AssociadoSearchForm 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          setSearchType={setSearchType}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          cidadeFilter={cidadeFilter}
          setCidadeFilter={setCidadeFilter}
          cidades={cidades}
          isSearching={loading}
          handleSearch={handleSearch}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          fetchAssociados={fetchAssociados}
        />
        
        <AssociadosTable 
          associados={associados} 
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default ListaAssociados;
