
import React from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldErrors } from 'react-hook-form';
import { AssociadoFormData } from '../../types';

interface EmailFieldProps {
  register: any;
  errors: FieldErrors<AssociadoFormData>;
}

export const EmailField: React.FC<EmailFieldProps> = ({ register, errors }) => {
  return (
    <div>
      <Label htmlFor="email" className="flex items-center gap-2">
        <Mail size={16} />
        E-mail*
      </Label>
      <Input
        id="email"
        type="email"
        className={`${errors.email ? 'border-red-500' : ''}`}
        {...register('email', { 
          required: "E-mail é obrigatório",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "E-mail inválido"
          } 
        })}
      />
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
    </div>
  );
};
