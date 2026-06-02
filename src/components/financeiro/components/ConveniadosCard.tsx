
import React from 'react';
import { Users } from 'lucide-react';
import { type FinancialSummary } from '../types';

interface ConveniadosCardProps {
  clients: FinancialSummary['clients'];
  openInNewTab: (url: string) => void;
}

const ConveniadosCard: React.FC<ConveniadosCardProps> = ({ clients, openInNewTab }) => {
  return (
    <div className="wp-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <Users className="mr-2 h-5 w-5 text-gray-500" />
          Conveniados
        </h2>
      </div>

      <div className="space-y-4">
        {/* EM DIA - Now clickable */}
        <div 
          className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => openInNewTab('/conveniados/listar?status=ativo')}
        >
          <div className="text-xs text-gray-500 mb-1">EM DIA</div>
          <div className="text-5xl font-bold text-green-500">
            {clients.total}
          </div>
        </div>

        {/* INADIMPLENTES - Now clickable */}
        <div 
          className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => openInNewTab('/conveniados/listar?status=inadimplente')}
        >
          <div className="text-xs text-gray-500 mb-1">INADIMPLENTES</div>
          <div className="text-5xl font-bold text-red-600">
            {clients.defaulters}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConveniadosCard;
