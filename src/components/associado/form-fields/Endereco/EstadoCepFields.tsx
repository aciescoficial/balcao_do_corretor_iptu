
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { estados } from '../../types';

interface EstadoCepFieldsProps {
  register: any;
  watch: any;
  setValue: any;
}

export const EstadoCepFields: React.FC<EstadoCepFieldsProps> = ({ register, watch, setValue }) => {
  return (
    <>
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
    </>
  );
};
