
import { SugestaoStatus } from './types';
import { Badge } from '@/components/ui/badge';
import React from 'react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'novo':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Novo</Badge>;
    case 'em_progresso':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Em progresso</Badge>;
    case 'ganho':
      return <Badge className="bg-green-500 hover:bg-green-600">Aprovado</Badge>;
    case 'cancelado':
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelado</Badge>;
    case 'frio':
      return <Badge className="bg-gray-500 hover:bg-gray-600">Frio</Badge>;
    default:
      return <Badge>Desconhecido</Badge>;
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
