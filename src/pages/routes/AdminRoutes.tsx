import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../AuthRoutes';
import PluginLayout from '@/components/PluginLayout';
import Dashboard from '@/components/Dashboard';

// Lazily load components
const CadastroAssociado = React.lazy(() => import('@/components/CadastroAssociado'));
const PesquisaAssociado = React.lazy(() => import('@/components/PesquisaAssociado'));
const AprovacoesPendentes = React.lazy(() => import('@/components/aprovacoes/AprovacoesPendentes'));
const CadastroEmpresa = React.lazy(() => import('@/components/CadastroEmpresa'));
const EmpresasPesquisa = React.lazy(() => import('@/components/empresa/EmpresasPesquisa'));
const EmpresaSugestoes = React.lazy(() => import('@/components/empresa/EmpresaSugestoes'));
// Use dynamic import to avoid name collision
const EmpresaDetailPage = React.lazy(() => import('@/components/empresa/EmpresaDetailPage'));
const GeradorCarteirinha = React.lazy(() => import('@/components/carteirinha/GeradorCarteirinha'));
const IntegracaoFinanceira = React.lazy(() => import('@/components/IntegracaoFinanceira'));
const UserManagement = React.lazy(() => import('@/components/usuarios/UserManagement'));
const PermissionPanel = React.lazy(() => import('@/components/usuarios/permission/PermissionPanel'));
const FinanceiroResumoPage = React.lazy(() => import('@/components/financeiro/FinanceiroResumoPage'));
const AssociadosPage = React.lazy(() => import('@/components/financeiro/AssociadosPage'));
const ConfiguracoesPage = React.lazy(() => import('@/components/configuracoes/ConfiguracoesPage'));
const AprovacaoInteressePage = React.lazy(() => import('@/components/associado/AprovacaoInteressePage'));
// Add imports for messaging components
const MessagesDashboard = React.lazy(() => import('@/components/mensagens/MessagesDashboard'));
const MensagensPage = React.lazy(() => import('@/components/mensagens/MensagensPage'));

// Layout wrapper component to avoid circular dependencies
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PluginLayout>
    {children}
  </PluginLayout>
);

// Placeholder for CobrancasPage to avoid circular imports
const CobrancasPage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Lista de Cobranças</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página está em construção.
      </p>
    </div>
  </div>
);

// Fallback component with custom loading time
const PageLoading = () => <div>Carregando página...</div>;

export const AdminRoutes = [
  // Dashboard Route
  <Route key="admin-dashboard" path="/admin/dashboard" element={
    <AdminRoute>
      <LayoutWrapper>
        <Dashboard />
      </LayoutWrapper>
    </AdminRoute>
  } />,

  // User Management Routes
  <Route key="usuarios-gerenciar" path="/usuarios/gerenciar" element={
    <AdminRoute>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <UserManagement />
        </React.Suspense>
      </LayoutWrapper>
    </AdminRoute>
  } />,
  
  <Route key="usuarios-permissoes" path="/usuarios/permissoes" element={
    <AdminRoute>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <PermissionPanel />
        </React.Suspense>
      </LayoutWrapper>
    </AdminRoute>
  } />,
  
  // Associados Routes (Admin)
  <Route key="associados-cadastro" path="/associados/cadastro" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <CadastroAssociado />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-pendentes" path="/associados/pendentes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <AprovacoesPendentes />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,

  <Route key="associados-aprovacao" path="/associados/aprovacao" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <AprovacaoInteressePage />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="associados-carteirinha" path="/associados/carteirinha" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <GeradorCarteirinha />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Empresas Routes (Admin)
  <Route key="empresas-cadastrar" path="/empresas/cadastrar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <CadastroEmpresa />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-pendentes" path="/empresas/pendentes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <AprovacoesPendentes />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-pesquisar" path="/empresas/pesquisar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <EmpresasPesquisa />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-detalhes" path="/empresas/detalhes/:id" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <EmpresaDetailPage />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-editar" path="/empresas/editar/:id" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <CadastroEmpresa />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-sugestoes" path="/empresas/sugestoes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <EmpresaSugestoes />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Mensagens Routes
  <Route key="mensagens" path="/mensagens" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <MessagesDashboard />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="mensagens-enviar" path="/mensagens/enviar" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <MensagensPage />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  // Financeiro Routes (Admin)
  <Route key="financeiro-resumo" path="/financeiro/resumo" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <FinanceiroResumoPage />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="financeiro-cobrancas" path="/financeiro/cobrancas" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <CobrancasPage />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="financeiro-associados" path="/financeiro/associados" element={
    <AdminRoute>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <AssociadosPage />
        </React.Suspense>
      </LayoutWrapper>
    </AdminRoute>
  } />,
  
  <Route key="financeiro-integracoes" path="/financeiro/integracoes" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <IntegracaoFinanceira />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="financeiro-relatorios" path="/financeiro/relatorios" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <Dashboard />
        </React.Suspense>
      </LayoutWrapper>
    </ProtectedRoute>
  } />,
  
  <Route key="configuracoes" path="/configuracoes" element={
    <AdminRoute>
      <LayoutWrapper>
        <React.Suspense fallback={<PageLoading />}>
          <ConfiguracoesPage />
        </React.Suspense>
      </LayoutWrapper>
    </AdminRoute>
  } />,
];
