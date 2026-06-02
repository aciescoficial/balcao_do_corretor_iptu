
import React from 'react';
import { UserCog, Shield, CheckSquare, Users } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getAdminMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Gestão de Usuários", 
      icon: Users,
      roles: ['admin'],
      submenu: [
        { icon: UserCog, label: "Usuários", path: "/usuarios", roles: ['admin'] },
        { icon: Shield, label: "Permissões", path: "/usuarios/permissoes", roles: ['admin'] },
        { icon: CheckSquare, label: "Aprovações Pendentes", path: "/aprovacoes", roles: ['admin'] },
      ]
    }
  ];
};
