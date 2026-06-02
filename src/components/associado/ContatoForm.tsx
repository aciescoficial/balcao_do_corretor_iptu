
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AssociadoFormData } from './types';
import { EmailField } from './form-fields/Contato/EmailField';
import { TelefoneField } from './form-fields/Contato/TelefoneField';

interface ContatoFormProps {
  form: UseFormReturn<AssociadoFormData>;
}

export const ContatoForm: React.FC<ContatoFormProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-full">
        <h3 className="text-lg font-medium mb-2">Informações de Contato</h3>
      </div>
      
      <EmailField register={register} errors={errors} />
      <TelefoneField register={register} errors={errors} />
    </div>
  );
};
