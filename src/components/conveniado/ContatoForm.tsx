
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ConveniadoFormData } from './types';

interface ContatoFormProps {
  form: UseFormReturn<ConveniadoFormData>;
}

export const ContatoForm: React.FC<ContatoFormProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-full">
        <h3 className="text-lg font-medium mb-2">Informações de Contato</h3>
      </div>
      
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
    </div>
  );
};
