
import React from 'react';
import { DollarSign, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ConveniadoFormData, tiposPagamento, tiposAssociados } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FinanceiroFormProps {
  form: UseFormReturn<ConveniadoFormData>;
}

export const FinanceiroForm: React.FC<FinanceiroFormProps> = ({ form }) => {
  const { register, watch, setValue } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-full">
        <h3 className="text-lg font-medium mb-2">Informações Financeiras</h3>
      </div>
      
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
      
      <div>
        <Label htmlFor="tipoPagamento">Tipo de Pagamento</Label>
        <Select 
          onValueChange={(value) => setValue('tipoPagamento', value)} 
          defaultValue={watch('tipoPagamento') || ''}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {tiposPagamento.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="tipoAssociado" className="flex items-center gap-2">
          <Tag size={16} />
          Tipo de Associado
        </Label>
        <Select 
          onValueChange={(value) => setValue('tipoAssociado', value)} 
          defaultValue={watch('tipoAssociado') || ''}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {tiposAssociados.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
