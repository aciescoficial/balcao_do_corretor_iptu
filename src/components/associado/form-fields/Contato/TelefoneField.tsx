
import React from 'react';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldErrors } from 'react-hook-form';
import { AssociadoFormData } from '../../types';

interface TelefoneFieldProps {
  register: any;
  errors: FieldErrors<AssociadoFormData>;
}

export const TelefoneField: React.FC<TelefoneFieldProps> = ({ register, errors }) => {
  return (
    <div>
      <Label htmlFor="celular" className="flex items-center gap-2">
        <Phone size={16} />
        Celular*
      </Label>
      <Input
        id="celular"
        type="text"
        placeholder="(00) 00000-0000"
        className={`${errors.celular ? 'border-red-500' : ''}`}
        {...register('celular', { required: "Celular é obrigatório" })}
      />
      {errors.celular && <p className="text-red-500 text-sm mt-1">{errors.celular.message}</p>}
    </div>
  );
};
