
import React from 'react';
import { Settings, Shield, Database, Code } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getConfiguracoesMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Configurações", 
      icon: Settings,
      roles: ['admin'],
      submenu: [
        { icon: Settings, label: "Configurações Gerais", path: "/configuracoes", roles: ['admin'] },
        { icon: Shield, label: "Segurança", path: "/configuracoes?tab=seguranca", roles: ['admin'] },
        { icon: Database, label: "Integração API", path: "/configuracoes?tab=api", roles: ['admin'] },
        { icon: Code, label: "Sistema", path: "/configuracoes?tab=sistema", roles: ['admin'] },
      ]
    }
  ];
};
