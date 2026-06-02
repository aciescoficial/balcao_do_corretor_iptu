
import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

export const getDashboardMenuItems = (): MenuItem[] => {
  return [
    { icon: Home, label: "Dashboard", path: "/dashboard", roles: ['admin', 'user', 'empresa'] },
    { icon: MessageSquare, label: "Mensagens", path: "/mensagens", roles: ['admin', 'user', 'empresa'] }
  ];
};
