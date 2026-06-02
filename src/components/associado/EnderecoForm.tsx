
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AssociadoFormData } from './types';
import { RuaNumeroFields } from './form-fields/Endereco/RuaNumeroFields';
import { ComplementoBairroFields } from './form-fields/Endereco/ComplementoBairroFields';
import { CidadeField } from './form-fields/Endereco/CidadeField';
import { EstadoCepFields } from './form-fields/Endereco/EstadoCepFields';

interface EnderecoFormProps {
  form: UseFormReturn<AssociadoFormData>;
}

export const EnderecoForm: React.FC<EnderecoFormProps> = ({ form }) => {
  const { register, watch, setValue, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-full">
        <h3 className="text-lg font-medium mb-2">Endereço</h3>
      </div>
      
      <RuaNumeroFields register={register} />
      <ComplementoBairroFields register={register} />
      <CidadeField register={register} errors={errors} />
      <EstadoCepFields register={register} watch={watch} setValue={setValue} />
    </div>
  );
};
