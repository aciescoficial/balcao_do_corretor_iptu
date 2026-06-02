
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ValoresFieldsProps {
  register: any;
}

export const ValoresFields: React.FC<ValoresFieldsProps> = ({ register }) => {
  return (
    <>
      <div>
        <Label htmlFor="valorPago" className="flex items-center gap-2">
          <DollarSign size={16} />
          Valor Pago
        </Label>
        <Input
          id="valorPago"
          type="text"
          placeholder="R$ 0,00"
          {...register('valorPago')}
        />
      </div>
      
      <div>
        <Label htmlFor="dataUltimoPagamento">Data Último Pagamento</Label>
        <Input
          id="dataUltimoPagamento"
          type="date"
          {...register('dataUltimoPagamento')}
        />
      </div>
      
      <div>
        <Label htmlFor="valorDevido">Valor Devido</Label>
        <Input
          id="valorDevido"
          type="text"
          placeholder="R$ 0,00"
          {...register('valorDevido')}
        />
      </div>
    </>
  );
};
