
import React from 'react';
import { DollarSign, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type FinancialSummary } from '../types';

interface FaturamentoCardProps {
  revenue: FinancialSummary['revenue'];
}

const FaturamentoCard: React.FC<FaturamentoCardProps> = ({ revenue }) => {
  return (
    <div className="wp-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
          Faturamento
        </h2>
      </div>

      <div className="space-y-4">
        {/* PREVISTO */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-xs text-gray-500 mb-1">PREVISTO</div>
          <div className="text-3xl font-bold text-amber-500 flex items-center">
            <span className="text-sm mr-1">R$</span>
            {new Intl.NumberFormat('pt-BR').format(revenue.expected)}
          </div>
        </div>

        {/* CONFIRMADO */}
        <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">CONFIRMADO</div>
            <div className="text-3xl font-bold text-blue-800 flex items-center">
              <span className="text-sm mr-1">R$</span>
              {new Intl.NumberFormat('pt-BR').format(revenue.confirmed)}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* RECEBIDO */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-xs text-gray-500 mb-1">RECEBIDO</div>
          <div className="text-3xl font-bold text-green-500 flex items-center">
            <span className="text-sm mr-1">R$</span>
            {new Intl.NumberFormat('pt-BR').format(revenue.received)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaturamentoCard;
