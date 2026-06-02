import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './types/formTypes';

interface EmpresaEnderecoProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaEndereco: React.FC<EmpresaEnderecoProps> = ({ register, errors }) => {
  return (
    <>
      {/* Endereço */}
      <div className="space-y-2 md:col-span-2">
        <label className="block text-sm font-medium">Endereço*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.endereco ? 'border-wp-error' : ''}`}
          {...register('endereco', { required: "Endereço é obrigatório" })}
        />
        {errors.endereco && <p className="text-wp-error text-sm">{errors.endereco.message}</p>}
      </div>
      
      {/* Cidade */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Cidade*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.cidade ? 'border-wp-error' : ''}`}
          {...register('cidade', { required: "Cidade é obrigatória" })}
        />
        {errors.cidade && <p className="text-wp-error text-sm">{errors.cidade.message}</p>}
      </div>
      
      {/* CEP */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">CEP*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.cep ? 'border-wp-error' : ''}`}
          placeholder="00000-000"
          {...register('cep', { required: "CEP é obrigatório" })}
        />
        {errors.cep && <p className="text-wp-error text-sm">{errors.cep.message}</p>}
      </div>
    </>
  );
};

export default EmpresaEndereco;
