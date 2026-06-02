
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import PluginLayout from '@/components/PluginLayout';
import FinanceiroResumoPage from '@/components/financeiro/FinanceiroResumoPage';
import AssociadosPage from '@/components/financeiro/AssociadosPage';
import FinanceiroRelatoriosPage from '@/components/financeiro/FinanceiroRelatoriosPage';
import IntegracaoFinanceira from '@/components/IntegracaoFinanceira';
import { LoaderCircle } from 'lucide-react';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-64">
    <LoaderCircle className="animate-spin h-8 w-8 text-gray-900 mb-2" />
    <p className="text-sm text-gray-600">Carregando...</p>
  </div>
);

// Finance access route component
export const FinanceRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, hasFinanceiroAccess } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasFinanceiroAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Layout wrapper component
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PluginLayout>
    {children}
  </PluginLayout>
);

// Export the finance routes
export const FinanceiroRoutes = [
  <Route key="financeiro" path="/financeiro" element={
    <FinanceRoute>
      <LayoutWrapper>
        <FinanceiroResumoPage />
      </LayoutWrapper>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-associados" path="/financeiro/associados" element={
    <FinanceRoute>
      <LayoutWrapper>
        <AssociadosPage />
      </LayoutWrapper>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-relatorios" path="/financeiro/relatorios" element={
    <FinanceRoute>
      <LayoutWrapper>
        <FinanceiroRelatoriosPage />
      </LayoutWrapper>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-integracao" path="/financeiro/integracao" element={
    <FinanceRoute>
      <LayoutWrapper>
        <IntegracaoFinanceira />
      </LayoutWrapper>
    </FinanceRoute>
  } />,
];
