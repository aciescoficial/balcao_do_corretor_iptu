
import React from 'react';
import { CreditCard, ClipboardList, Building, User, FileSearch } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getUserMenuItems = (): MenuItem[] => {
  return [
    {
      header: "Área do Associado",
      icon: User,
      roles: ['user'],
      submenu: [
        { icon: CreditCard, label: "Meus Pagamentos", path: "/meus-pagamentos", roles: ['user'] },
        { icon: CreditCard, label: "Solicitar Carteirinha", path: "/solicitar-carteirinha", roles: ['user'] },
        { icon: ClipboardList, label: "Atualizar Dados", path: "/perfil", roles: ['user'] },
        { icon: Building, label: "Empresas Conveniadas", path: "/empresas-conveniadas", roles: ['user'] },
        { icon: FileSearch, label: "Consulta IPTU", path: "/consulta-iptu", roles: ['user', 'admin', 'diretoria', 'associado'] },
      ]
    }
  ];
};
