
import React from 'react';
import { User, CreditCard, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { ConveniadoFormData } from './types';
import { FotoUpload } from './FotoUpload';

interface DadosPessoaisFormProps {
  form: UseFormReturn<ConveniadoFormData>;
  fotoPreview: string | null;
  onFotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFotoRemove: () => void;
}

export const DadosPessoaisForm: React.FC<DadosPessoaisFormProps> = ({ 
  form, 
  fotoPreview,
  onFotoUpload,
  onFotoRemove
}) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="flex items-start space-x-4 mb-6">
      <FotoUpload 
        fotoPreview={fotoPreview}
        onUpload={onFotoUpload}
        onRemove={onFotoRemove}
        register={register}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <Label htmlFor="creci">Número CRECI-SC</Label>
          <Input
            id="creci"
            type="text"
            {...register('creci')}
          />
        </div>
        
        <div>
          <Label htmlFor="dataNascimento" className="flex items-center gap-2">
            <Calendar size={16} />
            Data de Nascimento
          </Label>
          <Input
            id="dataNascimento"
            type="date"
            {...register('dataNascimento')}
          />
        </div>

        <div>
          <Label htmlFor="validade" className="flex items-center gap-2">
            <Calendar size={16} />
            Validade
          </Label>
          <Input
            id="validade"
            type="date"
            {...register('validade')}
          />
        </div>
      </div>
    </div>
  );
};
