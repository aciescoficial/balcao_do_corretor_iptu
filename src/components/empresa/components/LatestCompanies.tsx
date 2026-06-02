
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmpresaData } from '../types';
import { LoadingState } from './latest-companies/LoadingState';
import { EmptyState } from './latest-companies/EmptyState';
import { CompanyListItem } from './latest-companies/CompanyListItem';
import { useLatestCompanies } from '../hooks/useLatestCompanies';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LatestCompaniesProps {
  onLocateEmpresa?: (empresa: EmpresaData) => void;
}

const CompanyContent = ({ companies, loading, onLocateEmpresa }: { 
  companies: EmpresaData[],
  loading: boolean,
  onLocateEmpresa?: (empresa: EmpresaData) => void 
}) => {
  if (loading) {
    return <LoadingState />;
  }
  
  if (companies.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {companies.map(company => (
        <CompanyListItem 
          key={company.id}
          company={company}
          onLocate={onLocateEmpresa}
        />
      ))}
    </div>
  );
};

const ErrorFallback = () => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Erro ao carregar empresas</AlertTitle>
    <AlertDescription>
      Não foi possível carregar a lista de empresas. Por favor, tente novamente mais tarde.
    </AlertDescription>
  </Alert>
);

const LatestCompanies: React.FC<LatestCompaniesProps> = ({ onLocateEmpresa }) => {
  const { companies, loading } = useLatestCompanies(3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Empresas Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <CompanyContent 
            companies={companies} 
            loading={loading} 
            onLocateEmpresa={onLocateEmpresa}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

export default LatestCompanies;
