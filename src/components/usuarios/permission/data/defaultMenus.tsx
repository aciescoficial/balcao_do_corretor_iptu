
import React from 'react';
import { 
  LayoutDashboard, Users, Shield, Building, 
  DollarSign, CreditCard, MessageSquare, Settings 
} from 'lucide-react';
import { MenuPermission } from '../types';

export const getDefaultMenus = (): MenuPermission[] => [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <LayoutDashboard size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'view_dashboard', description: 'Visualizar dashboard', enabled: true }
    ]
  },
  {
    id: 'usuarios',
    name: 'Usuários',
    icon: <Users size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'view_users', description: 'Visualizar usuários', enabled: true },
      { id: 'manage_users', description: 'Gerenciar usuários', enabled: true }
    ]
  },
  {
    id: 'permissoes',
    name: 'Permissões',
    icon: <Shield size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'view_permissions', description: 'Visualizar permissões', enabled: true },
      { id: 'manage_permissions', description: 'Gerenciar permissões', enabled: true }
    ]
  },
  {
    id: 'associados',
    name: 'Associados',
    icon: <Users size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'register_associado', description: 'Cadastrar associado', enabled: true },
      { id: 'search_associado', description: 'Pesquisar associado', enabled: true },
      { id: 'approve_associado', description: 'Aprovar interessados', enabled: true },
      { id: 'generate_card', description: 'Gerar carteirinha', enabled: true }
    ]
  },
  {
    id: 'empresas',
    name: 'Empresas',
    icon: <Building size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'register_empresa', description: 'Cadastrar empresa', enabled: true },
      { id: 'search_empresa', description: 'Pesquisar empresa', enabled: true },
      { id: 'suggestions_empresa', description: 'Sugestões de empresas', enabled: true }
    ]
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: <DollarSign size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'view_summary', description: 'Visualizar resumo', enabled: true },
      { id: 'manage_associados', description: 'Gerenciar associados', enabled: true },
      { id: 'manage_integration', description: 'Gerenciar integração', enabled: true },
      { id: 'view_reports', description: 'Visualizar relatórios', enabled: true }
    ]
  },
  {
    id: 'carteirinhas',
    name: 'Carteirinhas',
    icon: <CreditCard size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'generate_card', description: 'Gerar carteirinha', enabled: true },
      { id: 'request_card', description: 'Solicitar carteirinha', enabled: true }
    ]
  },
  {
    id: 'mensagens',
    name: 'Mensagens',
    icon: <MessageSquare size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'view_messages', description: 'Visualizar mensagens', enabled: true },
      { id: 'send_messages', description: 'Enviar mensagens', enabled: true }
    ]
  },
  {
    id: 'configuracoes',
    name: 'Configurações',
    icon: <Settings size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'general_settings', description: 'Configurações gerais', enabled: true },
      { id: 'admin_settings', description: 'Administração', enabled: true },
      { id: 'api_settings', description: 'Integração API', enabled: true },
      { id: 'system_settings', description: 'Sistema', enabled: true }
    ]
  },
  {
    id: 'area_associado',
    name: 'Área do Associado',
    icon: <Users size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'view_payments', description: 'Meus pagamentos', enabled: true },
      { id: 'update_profile', description: 'Atualizar dados', enabled: true },
      { id: 'view_companies', description: 'Empresas conveniadas', enabled: true }
    ]
  },
  {
    id: 'area_empresa',
    name: 'Área da Empresa',
    icon: <Building size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'update_company', description: 'Atualizar dados', enabled: true },
      { id: 'search_members', description: 'Pesquisar associados', enabled: true }
    ]
  },
  {
    id: 'comunicacao',
    name: 'Comunicação',
    icon: <MessageSquare size={16} />,
    enabled: true,
    subPermissions: [
      { id: 'send_messages', description: 'Enviar mensagens', enabled: true }
    ]
  }
];
