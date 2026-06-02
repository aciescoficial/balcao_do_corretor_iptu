
import React from 'react';
import { Receipt } from 'lucide-react';
import { type FinancialSummary } from '../types';

interface CobrancasCardProps {
  bills: FinancialSummary['bills'];
  openInNewTab: (url: string) => void;
}

const CobrancasCard: React.FC<CobrancasCardProps> = ({ bills, openInNewTab }) => {
  return (
    <div className="wp-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <Receipt className="mr-2 h-5 w-5 text-gray-500" />
          Cobranças
        </h2>
      </div>

      <div className="space-y-4">
        {/* PREVISTAS - Now clickable */}
        <div 
          className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => openInNewTab('/financeiro/cobrancas?status=prevista')}
        >
          <div className="text-xs text-gray-500 mb-1">PREVISTAS</div>
          <div className="text-5xl font-bold text-amber-500">
            {bills.expected}
          </div>
        </div>

        {/* VENCIDAS - Now clickable */}
        <div 
          className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => openInNewTab('/financeiro/cobrancas?status=vencida')}
        >
          <div className="text-xs text-gray-500 mb-1">VENCIDAS</div>
          <div className="text-5xl font-bold text-red-600">
            {bills.overdue}
          </div>
        </div>

        {/* RECEBIDAS - Now clickable */}
        <div 
          className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => openInNewTab('/financeiro/cobrancas?status=recebida')}
        >
          <div className="text-xs text-gray-500 mb-1">RECEBIDAS</div>
          <div className="text-5xl font-bold text-green-500">
            {bills.received}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CobrancasCard;
