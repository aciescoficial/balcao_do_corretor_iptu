
import React from 'react';
import { Check, X } from 'lucide-react';
import { StatusType } from './types';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'ativo':
      return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white"><Check size={14} />Ativo</span>;
    case 'pendente':
      return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">Pendente</span>;
    case 'inativo':
      return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white"><X size={14} />Inativo</span>;
    default:
      return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-gray-200">{status}</span>;
  }
};

export default StatusBadge;
