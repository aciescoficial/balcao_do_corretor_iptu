
import React from 'react';
import { StatusType } from '../../types';

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ativo':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Ativo</span>;
    case 'pendente':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendente</span>;
    case 'inativo':
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inativo</span>;
    default:
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
  }
};
