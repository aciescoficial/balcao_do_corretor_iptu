
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, CreditCard } from 'lucide-react';

interface TaxaEntregaCardProps {
  valor: number;
}

export const TaxaEntregaCard: React.FC<TaxaEntregaCardProps> = ({ valor }) => {
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  return (
    <Card className="border border-yellow-200 bg-yellow-50">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-yellow-100 p-3 rounded-full">
          <Truck className="h-6 w-6 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Taxa de Entrega</h3>
          <p className="text-sm text-muted-foreground">
            Valor cobrado para confecção e envio da carteirinha
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <CreditCard className="h-4 w-4 text-green-600" />
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(valor)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
