
import React, { useEffect } from 'react';
import { NotificationMessage } from '@/components/layout/NotificationBanner';

interface NotificationManagerProps {
  // No visible content, just manages notifications
}

const exampleMessages: NotificationMessage[] = [
  {
    id: '1',
    text: 'Sua Anuidade ACIESC está vencendo em 3 dia(s).',
    type: 'payment',
    action: {
      url: '/meus-pagamentos',
      text: 'Pagar agora'
    }
  },
  {
    id: '2',
    text: 'VOCÊ ESTÁ INATIVO NO MOMENTO! A sua Anuidade ACIESC venceu.',
    type: 'inactive',
    action: {
      url: '/reativar',
      text: 'Reativar agora'
    }
  },
  {
    id: '3',
    text: 'PRÓXIMO EVENTO! Festa dos AMIGOS em Itapema.',
    type: 'event',
    action: {
      url: '/eventos/festa-amigos',
      text: 'Saiba mais'
    }
  }
];

const NotificationManager: React.FC<NotificationManagerProps> = () => {
  useEffect(() => {
    if (!window.localStorage.getItem('demoMessages')) {
      window.localStorage.setItem('demoMessages', JSON.stringify(exampleMessages));
      
      const timer = setTimeout(() => {
        window.localStorage.removeItem('demoMessages');
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return null; // This component doesn't render anything, it just sets up demo notifications
};

export default NotificationManager;
