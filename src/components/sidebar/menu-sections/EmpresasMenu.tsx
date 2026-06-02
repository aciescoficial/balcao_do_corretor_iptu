
import React from 'react';
import { Building, Search, Inbox } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getEmpresasMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Empresas", 
      icon: Building,
      roles: ['admin'],
      submenu: [
        { icon: Building, label: "Cadastrar", path: "/empresas/cadastrar", roles: ['admin'] },
        { icon: Search, label: "Pesquisar", path: "/empresas/pesquisar", roles: ['admin'] },
        { icon: Inbox, label: "Sugestões", path: "/empresas/sugestoes", roles: ['admin'] },
      ]
    }
  ];
};
