
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { AssociadoFormData } from './types';
import { VeiculoPrincipalFields } from './form-fields/Veiculo/VeiculoPrincipalFields';
import { VeiculoSecundarioFields } from './form-fields/Veiculo/VeiculoSecundarioFields';

interface VeiculoFormProps {
  form: UseFormReturn<AssociadoFormData>;
}

export const VeiculoForm: React.FC<VeiculoFormProps> = ({ form }) => {
  const { register, setValue, watch } = form;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Informações do Veículo Principal</h3>
        <VeiculoPrincipalFields 
          register={register} 
          watch={watch} 
          setValue={setValue} 
        />
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Informações do Veículo Secundário</h3>
        <VeiculoSecundarioFields 
          register={register} 
          watch={watch} 
          setValue={setValue} 
        />
      </div>
    </div>
  );
};
