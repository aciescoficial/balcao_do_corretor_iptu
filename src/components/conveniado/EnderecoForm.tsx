
import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ConveniadoFormData, estados } from './types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnderecoFormProps {
  form: UseFormReturn<ConveniadoFormData>;
}

export const EnderecoForm: React.FC<EnderecoFormProps> = ({ form }) => {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-full">
        <h3 className="text-lg font-medium mb-2">Endereço</h3>
      </div>
      
      <div>
        <Label htmlFor="rua" className="flex items-center gap-2">
          <MapPin size={16} />
          Rua
        </Label>
        <Input
          id="rua"
          type="text"
          {...register('rua')}
        />
      </div>
      
      <div className="md:col-span-1">
        <Label htmlFor="numero">Número</Label>
        <Input
          id="numero"
          type="text"
          {...register('numero')}
        />
      </div>
      
      <div>
        <Label htmlFor="complemento">Complemento</Label>
        <Input
          id="complemento"
          type="text"
          {...register('complemento')}
        />
      </div>
      
      <div>
        <Label htmlFor="bairro">Bairro</Label>
        <Input
          id="bairro"
          type="text"
          {...register('bairro')}
        />
      </div>
      
      <div>
        <Label htmlFor="cidade">Cidade*</Label>
        <Input
          id="cidade"
          type="text"
          className={`${errors.cidade ? 'border-red-500' : ''}`}
          {...register('cidade', { required: "Cidade é obrigatória" })}
        />
        {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="estado">Estado</Label>
        <Select 
          onValueChange={(value) => setValue('estado', value)} 
          defaultValue={watch('estado') || ''}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>
          <SelectContent>
            {estados.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="cep">CEP</Label>
        <Input
          id="cep"
          type="text"
          placeholder="00000-000"
          {...register('cep')}
        />
      </div>
    </div>
  );
};
