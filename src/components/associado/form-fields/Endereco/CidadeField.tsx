
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldErrors } from 'react-hook-form';
import { AssociadoFormData } from '../../types';

interface CidadeFieldProps {
  register: any;
  errors: FieldErrors<AssociadoFormData>;
}

export const CidadeField: React.FC<CidadeFieldProps> = ({ register, errors }) => {
  return (
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
  );
};
