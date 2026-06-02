
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AssociadoFormData } from './types';
import { FotoField } from './form-fields/DadosPessoais/FotoField';
import { IdentificacaoFields } from './form-fields/DadosPessoais/IdentificacaoFields';
import { DocumentosFields } from './form-fields/DadosPessoais/DocumentosFields';

interface DadosPessoaisFormProps {
  form: UseFormReturn<AssociadoFormData>;
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
      <FotoField 
        fotoPreview={fotoPreview}
        onFotoUpload={onFotoUpload}
        onFotoRemove={onFotoRemove}
        register={register}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <IdentificacaoFields 
          register={register} 
          errors={errors} 
        />
        <DocumentosFields register={register} />
      </div>
    </div>
  );
};
