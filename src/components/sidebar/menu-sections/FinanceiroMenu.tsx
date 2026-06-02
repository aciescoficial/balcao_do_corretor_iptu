
import React from 'react';
import { BarChart, UserCheck, DollarSign, FileText } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getFinanceiroMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Financeiro", 
      roles: ['admin'],
      requiredTags: ['financeiro'],
      submenu: [
        { icon: BarChart, label: "Resumo", path: "/financeiro/resumo", roles: ['admin'], requiredTags: ['financeiro'] },
        { icon: UserCheck, label: "Associados", path: "/financeiro/associados", roles: ['admin'], requiredTags: ['financeiro'] },
        { icon: DollarSign, label: "Integrações", path: "/financeiro/integracoes", roles: ['admin'], requiredTags: ['financeiro'] },
        { icon: FileText, label: "Relatórios", path: "/financeiro/relatorios", roles: ['admin'], requiredTags: ['financeiro'] },
      ]
    }
  ];
};
