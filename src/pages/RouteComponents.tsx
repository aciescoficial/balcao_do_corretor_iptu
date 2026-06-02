import React from 'react';
import PluginLayout from '@/components/PluginLayout';
import Dashboard from '@/components/Dashboard';
import CadastroAssociado from '@/components/CadastroAssociado';
import CadastroEmpresa from '@/components/CadastroEmpresa';
import PesquisaAssociado from '@/components/PesquisaAssociado';
import PesquisaEmpresa from '@/components/PesquisaEmpresa';
import AprovacoesPendentes from '@/components/AprovacoesPendentes';
import GeradorCarteirinha from '@/components/carteirinha/GeradorCarteirinha';
import IntegracaoFinanceira from '@/components/IntegracaoFinanceira';
import UserManagement from '@/components/usuarios/UserManagement';
import PermissionPanel from '@/components/usuarios/PermissionPanel';
import ProfilePage from '@/components/auth/profile/ProfilePage';
import AssociadosPage from '@/components/financeiro/AssociadosPage';
import FinanceiroResumoPage from '@/components/financeiro/FinanceiroResumoPage';
import MensagensPage from '@/components/mensagens/MensagensPage';
import MessagesDashboard from '@/components/mensagens/MessagesDashboard';
import EmpresasConveniadas from '@/components/associado/EmpresasConveniadas';
import EmpresasPesquisa from '@/components/empresa/EmpresasPesquisa';
import ConfiguracoesPage from '@/components/configuracoes/ConfiguracoesPage';
import FinanceiroRelatoriosPage from '@/components/financeiro/FinanceiroRelatoriosPage';
import Index from './Index';

// Placeholder component for Cobranças page
export const CobrancasPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Lista de Cobranças</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página está em construção.
      </p>
    </div>
  </div>
);

// Export MensagensPage route component
export { MensagensPage, MessagesDashboard };

// Placeholder for member payment page
export const PagamentosAssociadoPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Meus Pagamentos</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página de pagamentos está em construção.
      </p>
    </div>
  </div>
);

// Placeholder for member ID card request page
export const SolicitarCarteirinhaPage = () => (
  <div className="space-y-6">
    <h1 className="wp-header">Solicitar Carteirinha</h1>
    <div className="wp-card">
      <p className="text-muted-foreground">
        Esta página para solicitar carteirinha está em construção.
      </p>
    </div>
  </div>
);

// Component for listing partner companies page - using our new component
export const EmpresasConveniadasPage = () => (
  <EmpresasConveniadas />
);

// Component for empresa area's search feature
export const EmpresasPesquisaPage = () => (
  <EmpresasPesquisa />
);

// Layout wrapper component
export interface LayoutProps {
  children: React.ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutProps) => (
  <PluginLayout>
    {children}
  </PluginLayout>
);

// Export all components
const RouteComponents = {
  Index,
  Dashboard,
  CadastroAssociado,
  CadastroEmpresa,
  PesquisaAssociado,
  PesquisaEmpresa,
  AprovacoesPendentes,
  GeradorCarteirinha,
  IntegracaoFinanceira,
  UserManagement,
  PermissionPanel,
  ProfilePage,
  AssociadosPage,
  FinanceiroResumoPage,
  MensagensPage,
  MessagesDashboard,
  EmpresasConveniadas,
  EmpresasPesquisa,
  CobrancasPage,
  PagamentosAssociadoPage,
  SolicitarCarteirinhaPage,
  EmpresasConveniadasPage,
  EmpresasPesquisaPage,
  ConfiguracoesPage,
  FinanceiroRelatoriosPage,
  NotFound: () => <div>Página não encontrada</div>
};

export default RouteComponents;
