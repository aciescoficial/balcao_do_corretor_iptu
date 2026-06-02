
import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export type MessageStatus = 'unread' | 'read' | 'all';
export type MessagePriority = 'normal' | 'high' | 'urgent';
export type MessageSortType = 'date' | 'priority' | 'sender';

export interface Message {
  id: string;
  title: string;
  content: string;
  sender: string;
  date: string;
  read: boolean;
  priority: MessagePriority;
}

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: '1',
    title: 'Pagamento de mensalidade',
    content: 'Sua mensalidade está próxima do vencimento. Por favor, efetue o pagamento para evitar a suspensão do seu acesso.',
    sender: 'Sistema',
    date: '2025-04-10',
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Evento especial de networking',
    content: 'Estamos organizando um evento especial de networking para todos os associados. Confirme sua presença!',
    sender: 'Eventos ACIESC',
    date: '2025-04-08',
    read: false,
    priority: 'normal'
  },
  {
    id: '3',
    title: 'Atualização cadastral necessária',
    content: 'Precisamos que você atualize suas informações cadastrais para continuar oferecendo os melhores serviços.',
    sender: 'Administração',
    date: '2025-04-05',
    read: true,
    priority: 'normal'
  },
  {
    id: '4',
    title: 'Nova parceria firmada',
    content: 'Temos uma nova empresa parceira oferecendo descontos especiais para associados. Confira!',
    sender: 'Parcerias ACIESC',
    date: '2025-04-03',
    read: true,
    priority: 'normal'
  },
  {
    id: '5',
    title: 'URGENTE: Alteração de sistema',
    content: 'Nosso sistema estará em manutenção hoje à noite das 22h às 2h. Durante este período o acesso estará indisponível.',
    sender: 'Suporte Técnico',
    date: '2025-04-01',
    read: true,
    priority: 'urgent'
  },
  {
    id: '6',
    title: 'Atualização de segurança',
    content: 'Uma nova atualização de segurança foi aplicada à sua conta. Por favor, verifique suas configurações de privacidade.',
    sender: 'Segurança',
    date: '2025-04-11',
    read: false,
    priority: 'high'
  }
];

// Create a more efficient filtering system with debounce for search
export const useMessages = () => {
  const [filter, setFilter] = useState<MessageStatus>('all');
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to get messages from localStorage first
    const storedMessages = localStorage.getItem('aciesc-messages');
    if (storedMessages) {
      try {
        return JSON.parse(storedMessages);
      } catch (e) {
        console.error('Failed to parse stored messages:', e);
      }
    }
    return mockMessages;
  });
  const [sortType, setSortType] = useState<MessageSortType>('date');
  const [isFetching, setIsFetching] = useState(false);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('aciesc-messages', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to store messages:', e);
    }
  }, [messages]);

  // Fetch messages (simulated)
  const fetchMessages = useCallback(async () => {
    setIsFetching(true);
    
    try {
      // Simulate API fetch with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // For now, we'll just generate a new random message and refresh existing ones
      const newMessage: Message = {
        id: Date.now().toString(),
        title: `Nova notificação ${Math.floor(Math.random() * 100)}`,
        content: 'Esta é uma nova notificação gerada automaticamente.',
        sender: 'Sistema',
        date: new Date().toISOString().split('T')[0],
        read: false,
        priority: Math.random() > 0.8 ? 'high' : 'normal'
      };
      
      setMessages(prev => [newMessage, ...prev]);
      toast.success('Mensagens atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Não foi possível atualizar as mensagens. Tente novamente.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Filtered messages with optimized filtering
  const filteredMessages = useMemo(() => {
    let filtered = messages;
    
    // Filter by read status
    if (filter !== 'all') {
      filtered = messages.filter(message => 
        filter === 'unread' ? !message.read : message.read
      );
    }
    
    // Sort messages
    return [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'priority': {
          const priorityOrder = { urgent: 3, high: 2, normal: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'sender':
          return a.sender.localeCompare(b.sender);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [filter, messages, sortType]);

  // Message counts
  const unreadCount = useMemo(() => 
    messages.filter(m => !m.read).length, 
    [messages]
  );
  
  const readCount = useMemo(() => 
    messages.filter(m => m.read).length, 
    [messages]
  );

  // Mark as read with animation effect
  const markAsRead = useCallback((id: string) => {
    setMessages(prevMessages => prevMessages.map(message => 
      message.id === id ? { ...message, read: true } : message
    ));
    toast.success('Mensagem marcada como lida');
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setMessages(prevMessages => prevMessages.map(message => 
      !message.read ? { ...message, read: true } : message
    ));
    toast.success('Todas as mensagens foram marcadas como lidas');
  }, []);

  // Delete message with animation
  const deleteMessage = useCallback((id: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
    toast.success('Mensagem removida com sucesso');
  }, []);

  // Add new message with better type checking
  const addMessage = useCallback((messageData: Omit<Message, 'id' | 'read' | 'date'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      read: false,
      date: new Date().toISOString().split('T')[0],
    };
    
    setMessages(prev => [newMessage, ...prev]);
    toast.success('Nova mensagem adicionada');
    return newMessage;
  }, []);

  return {
    filter,
    setFilter,
    messages,
    filteredMessages,
    unreadCount,
    readCount,
    markAsRead,
    markAllAsRead,
    deleteMessage,
    addMessage,
    sortType,
    setSortType,
    fetchMessages,
    isFetching
  };
};

export default useMessages;
