
import React from 'react';
import { UserRole, UserTag, RoleInfo, TagInfo } from '../types';
import { Shield, User, Building2, Users } from 'lucide-react';

// Map role to badge color
export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'diretoria':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'empresa':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'user':
    default:
      return 'bg-green-100 text-green-800 border-green-300';
  }
};

// Map tag to badge color
export const getTagBadgeColor = (tag: UserTag): string => {
  switch (tag) {
    case 'corretor':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'corretor_autonomo':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'empresa_conveniada':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'diretoria_aciesc':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'administrador':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'financeiro':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'proprietario_imobiliaria':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'imobiliaria':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'aciesc':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

// Map role to label
export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'diretoria':
      return 'Diretoria';
    case 'empresa':
      return 'Empresa';
    case 'user':
    default:
      return 'Associado';
  }
};

// Map db role to UI role (if needed)
export const mapFromDbRole = (dbRole: string): UserRole => {
  switch (dbRole) {
    case 'admin':
      return 'admin';
    case 'diretoria':
      return 'diretoria';
    case 'empresa':
      return 'empresa';
    case 'user':
    default:
      return 'user';
  }
};

// Map UI role to db role
export const mapToDbRole = (uiRole: UserRole): string => {
  // If the roles are the same in UI and DB, just return the UI role
  return uiRole;
};

// Get available roles with info
export const getRoles = (): RoleInfo[] => {
  return [
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acesso completo ao sistema',
      icon: React.createElement(Shield)
    },
    {
      id: 'user',
      name: 'Associado',
      description: 'Acesso a funcionalidades de associado',
      icon: React.createElement(User)
    },
    {
      id: 'empresa',
      name: 'Empresa',
      description: 'Acesso a funcionalidades de empresa',
      icon: React.createElement(Building2)
    },
    {
      id: 'diretoria',
      name: 'Diretoria',
      description: 'Acesso a funcionalidades da diretoria',
      icon: React.createElement(Users)
    }
  ];
};

// Get available user tags
export const getUserTags = (): TagInfo[] => [
  {
    id: 'corretor',
    name: 'Corretor',
    description: 'Usuário é um corretor'
  },
  {
    id: 'corretor_autonomo',
    name: 'Corretor Autônomo',
    description: 'Usuário é um corretor autônomo'
  },
  {
    id: 'empresa_conveniada',
    name: 'Empresa Conveniada',
    description: 'Usuário é de uma empresa conveniada'
  },
  {
    id: 'diretoria_aciesc',
    name: 'Diretoria ACIESC',
    description: 'Usuário é um membro da diretoria da ACIESC'
  },
  {
    id: 'administrador',
    name: 'Administrador',
    description: 'Usuário tem privilégios de administrador'
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    description: 'Usuário tem acesso a funcionalidades financeiras'
  },
  {
    id: 'proprietario_imobiliaria',
    name: 'Proprietário Imobiliária',
    description: 'Usuário é um proprietário de imobiliária'
  },
  {
    id: 'imobiliaria',
    name: 'Imobiliária',
    description: 'Usuário está associado a uma imobiliária'
  },
  {
    id: 'aciesc',
    name: 'ACIESC',
    description: 'Usuário associado à ACIESC'
  }
];
