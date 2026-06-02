
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';
import Dashboard from '@/components/Dashboard';
import { ProfilePage } from '@/components/auth';
// Mensagens imports commented out
// import MensagensPage from '@/components/mensagens/MensagensPage';
// import MessagesDashboard from '@/components/mensagens/MessagesDashboard';
import EmpresasPesquisa from '@/components/empresa/EmpresasPesquisa';
import PagamentoSucesso from '@/components/pagamento/PagamentoSucesso';

// Layout wrapper component to avoid circular dependencies
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PluginLayout>
    {children}
  </PluginLayout>
);

// Component for empresa area's search feature
const EmpresasPesquisaPage = () => (
  <EmpresasPesquisa />
);

// Routes shared across multiple user types
export const SharedRoutes = [
  // Dashboard route - accessible to all authenticated users
  <Route key="dashboard" path="/" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <Dashboard />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Profile route - accessible to all authenticated users
  <Route key="perfil" path="/perfil" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <ProfilePage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Empresa search - accessible to all users
  <Route key="empresas-buscar" path="/empresas/buscar" element={
    <ProtectedRoute allowedRoles={['admin', 'user', 'empresa']}>
      <LayoutWrapper>
        <EmpresasPesquisaPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Messages Dashboard - accessible to all users (commented out to disable)
  /*
  <Route key="mensagens-dashboard" path="/mensagens" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <MessagesDashboard />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Original Messages page (sending messages) - moved to a different path
  <Route key="mensagens-envio" path="/mensagens/enviar" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <MensagensPage />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  */
  
  // Payment success page
  <Route key="pagamento-sucesso" path="/pagamento-sucesso" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <PagamentoSucesso />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Default route (fallback to Dashboard)
  <Route key="default" path="*" element={
    <ProtectedRoute>
      <LayoutWrapper>
        <Dashboard />
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
];
