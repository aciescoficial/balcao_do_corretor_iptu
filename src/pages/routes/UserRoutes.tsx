
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';
import PesquisaAssociado from '@/components/PesquisaAssociado';
import EmpresasConveniadas from '@/components/associado/EmpresasConveniadas';
import SolicitarCarteirinhaPage from '@/components/associado/SolicitarCarteirinhaPage';
import ConsultaIPTU from '@/components/iptu/ConsultaIPTU';

// Layout wrapper component to avoid circular dependencies
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PluginLayout>
    {children}
  </PluginLayout>
);

// Placeholder for member payment page
const PagamentosAssociadoPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Meus Pagamentos</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página de pagamentos está em construção.
      </p>
    </div>
  </div>
);

// Component for listing partner companies page
const EmpresasConveniadasPage = () => (
  <EmpresasConveniadas />
);

export const UserRoutes = [
  // Shared routes for admin and user
  <Route key="associados-pesquisar" path="/associados/pesquisa" element={
    <ProtectedRoute allowedRoles={['admin', 'user']}>
      <LayoutWrapper>
        <PesquisaAssociado />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // User specific routes
  <Route key="meus-pagamentos" path="/meus-pagamentos" element={
    <ProtectedRoute allowedRoles={['user']}>
      <LayoutWrapper>
        <PagamentosAssociadoPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="solicitar-carteirinha" path="/solicitar-carteirinha" element={
    <ProtectedRoute allowedRoles={['user']}>
      <LayoutWrapper>
        <SolicitarCarteirinhaPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-conveniadas" path="/empresas-conveniadas" element={
    <ProtectedRoute allowedRoles={['user']}>
      <LayoutWrapper>
        <EmpresasConveniadasPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,

  <Route key="consulta-iptu" path="/consulta-iptu" element={
    <ProtectedRoute allowedRoles={['user', 'admin', 'diretoria', 'associado']}>
      <LayoutWrapper>
        <ConsultaIPTU />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
];
