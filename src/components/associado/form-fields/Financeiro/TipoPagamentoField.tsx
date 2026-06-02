
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { tiposPagamento } from '../../types';

interface TipoPagamentoFieldProps {
  watch: any;
  setValue: any;
}

export const TipoPagamentoField: React.FC<TipoPagamentoFieldProps> = ({ watch, setValue }) => {
  return (
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
  );
};
