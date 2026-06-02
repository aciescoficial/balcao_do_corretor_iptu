
import React from 'react';
import { MessageCircle, Inbox, SendHorizonal } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';

// Create a function to return menu items
export const getComunicacaoMenuItems = (): MenuItem[] => {
  return [
    { 
      header: "Comunicação", 
      icon: MessageCircle,
      roles: ['admin', 'user', 'empresa'],
      submenu: [
        { icon: Inbox, label: "Caixa de Entrada", path: "/mensagens", roles: ['admin', 'user', 'empresa'] },
        { icon: SendHorizonal, label: "Enviar Mensagem", path: "/mensagens/enviar", roles: ['admin', 'user', 'empresa'] },
      ]
    }
  ];
};

// Create a proper React component to be memoized
const ComunicacaoMenu: React.FC = () => {
  return null; // This component doesn't render anything, it's just used to export menu items
};

export default React.memo(ComunicacaoMenu);
