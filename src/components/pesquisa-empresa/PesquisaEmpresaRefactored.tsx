
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { PaginatedCompanyList } from '../empresa/components/PaginatedCompanyList';
import { CompanySearchForm } from '../empresa/components/search/CompanySearchForm';
import { useCompanyQuery } from '@/hooks/queries/useCompanyQuery';
import type { CompanySearchFormValues } from '../empresa/components/search/schema';

const PesquisaEmpresaRefactored: React.FC = () => {
  const [searchParams, setSearchParams] = useState<CompanySearchFormValues | null>(null);
  const { data: results = [], isLoading } = useCompanyQuery(searchParams);

  const handleSearch = (params: CompanySearchFormValues) => {
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pesquisa de Empresas" 
        description="Localize e visualize informações sobre empresas cadastradas no sistema." 
      />
      
      <Card className="p-6">
        <CompanySearchForm 
          onSearch={handleSearch}
          isLoading={isLoading}
        />
        
        <div className="mt-6">
          <PaginatedCompanyList 
            initialData={results}
            searchable={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default PesquisaEmpresaRefactored;
