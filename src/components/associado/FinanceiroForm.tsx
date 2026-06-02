
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AssociadoFormData } from './types';
import { ValoresFields } from './form-fields/Financeiro/ValoresFields';
import { TipoPagamentoField } from './form-fields/Financeiro/TipoPagamentoField';
import { ComprovanteField } from './form-fields/Financeiro/ComprovanteField';
import { CriarUsuarioField } from './form-fields/Financeiro/CriarUsuarioField';

interface FinanceiroFormProps {
  form: UseFormReturn<AssociadoFormData>;
}

export const FinanceiroForm: React.FC<FinanceiroFormProps> = ({ form }) => {
  const { register, watch, setValue } = form;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('comprovantePagamento', e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-full">
          <h3 className="text-lg font-medium mb-2">Informações Financeiras</h3>
        </div>
        
        <ValoresFields register={register} />
        <TipoPagamentoField watch={watch} setValue={setValue} />
        <ComprovanteField handleFileChange={handleFileChange} />
      </div>

      <CriarUsuarioField watch={watch} setValue={setValue} />
    </div>
  );
};
