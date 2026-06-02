import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './types/formTypes';

interface EmpresaDadosGeraisProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaDadosGerais: React.FC<EmpresaDadosGeraisProps> = ({ register, errors }) => {
  return (
    <div className="wp-card">
      <h3 className="wp-subheader mb-4">Dados Gerais</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="razaoSocial" className="wp-label">Razão Social</label>
          <input 
            type="text" 
            id="razaoSocial" 
            className="wp-input"
            {...register("razaoSocial", { required: "Razão Social é obrigatória" })} 
          />
          {errors.razaoSocial && <p className="wp-error">{errors.razaoSocial.message}</p>}
        </div>

        <div>
          <label htmlFor="nomeFantasia" className="wp-label">Nome Fantasia</label>
          <input 
            type="text" 
            id="nomeFantasia" 
            className="wp-input"
            {...register("nomeFantasia", { required: "Nome Fantasia é obrigatório" })} 
          />
          {errors.nomeFantasia && <p className="wp-error">{errors.nomeFantasia.message}</p>}
        </div>

        <div>
          <label htmlFor="cnpj" className="wp-label">CNPJ</label>
          <input 
            type="text" 
            id="cnpj" 
            className="wp-input"
            {...register("cnpj", { required: "CNPJ é obrigatório" })}
          />
          {errors.cnpj && <p className="wp-error">{errors.cnpj.message}</p>}
        </div>

        <div>
          <label htmlFor="responsavel" className="wp-label">Responsável</label>
          <input 
            type="text" 
            id="responsavel" 
            className="wp-input"
            {...register("responsavel", { required: "Responsável é obrigatório" })} 
          />
          {errors.responsavel && <p className="wp-error">{errors.responsavel.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default EmpresaDadosGerais;
