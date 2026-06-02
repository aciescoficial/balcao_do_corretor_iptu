
import React from 'react';
import { User, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldErrors } from 'react-hook-form';
import { AssociadoFormData } from '../../types';

interface IdentificacaoFieldsProps {
  register: any;
  errors: FieldErrors<AssociadoFormData>;
}

export const IdentificacaoFields: React.FC<IdentificacaoFieldsProps> = ({ register, errors }) => {
  return (
    <>
      <div>
        <Label htmlFor="nome" className="flex items-center gap-2">
          <User size={16} />
          Nome*
        </Label>
        <Input
          id="nome"
          type="text"
          className={`${errors.nome ? 'border-red-500' : ''}`}
          {...register('nome', { required: "Nome é obrigatório" })}
        />
        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="sobrenome">Sobrenome*</Label>
        <Input
          id="sobrenome"
          type="text"
          className={`${errors.sobrenome ? 'border-red-500' : ''}`}
          {...register('sobrenome', { required: "Sobrenome é obrigatório" })}
        />
        {errors.sobrenome && <p className="text-red-500 text-sm mt-1">{errors.sobrenome.message}</p>}
      </div>

      <div>
        <Label htmlFor="cpf" className="flex items-center gap-2">
          <CreditCard size={16} />
          CPF*
        </Label>
        <Input
          id="cpf"
          type="text"
          placeholder="000.000.000-00"
          className={`${errors.cpf ? 'border-red-500' : ''}`}
          {...register('cpf', { required: "CPF é obrigatório" })}
        />
        {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>}
      </div>
    </>
  );
};
