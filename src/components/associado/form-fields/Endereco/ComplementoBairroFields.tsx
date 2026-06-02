
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ComplementoBairroFieldsProps {
  register: any;
}

export const ComplementoBairroFields: React.FC<ComplementoBairroFieldsProps> = ({ register }) => {
  return (
    <>
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
    </>
  );
};
