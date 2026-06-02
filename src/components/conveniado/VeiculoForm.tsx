
import React from 'react';
import { Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ConveniadoFormData } from './types';

interface VeiculoFormProps {
  form: UseFormReturn<ConveniadoFormData>;
}

export const VeiculoForm: React.FC<VeiculoFormProps> = ({ form }) => {
  const { register } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-full">
        <h3 className="text-lg font-medium mb-2">Informações do Veículo</h3>
      </div>
      
      <div>
        <Label htmlFor="placaPrincipal" className="flex items-center gap-2">
          <Car size={16} />
          Placa Principal
        </Label>
        <Input
          id="placaPrincipal"
          type="text"
          placeholder="AAA0A00"
          {...register('placaPrincipal')}
        />
      </div>
      
      <div>
        <Label htmlFor="placaSecundaria">Placa Secundária</Label>
        <Input
          id="placaSecundaria"
          type="text"
          placeholder="AAA0A00"
          {...register('placaSecundaria')}
        />
      </div>
    </div>
  );
};
