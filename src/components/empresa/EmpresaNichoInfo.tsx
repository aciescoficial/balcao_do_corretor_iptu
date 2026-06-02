import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './types/formTypes';
import { NichoType } from './types/formTypes';

interface EmpresaNichoInfoProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaNichoInfo: React.FC<EmpresaNichoInfoProps> = ({ register, errors }) => {
  return (
    <div className="wp-card">
      <h3 className="wp-subheader mb-4">Nicho e Informações Adicionais</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nicho" className="wp-label">Nicho de Atuação</label>
          <select 
            id="nicho" 
            className={`wp-input ${errors.nicho ? 'wp-input-error' : ''}`}
            {...register("nicho", { required: "O nicho de atuação é obrigatório" })}
          >
            <option value="">Selecione...</option>
            <option value="varejo">Varejo</option>
            <option value="servicos">Serviços</option>
            <option value="industria">Indústria</option>
          </select>
          {errors.nicho && <p className="wp-error-message">{errors.nicho.message}</p>}
        </div>

        <div>
          <label htmlFor="desconto" className="wp-label">Desconto Oferecido</label>
          <input 
            type="text" 
            id="desconto" 
            className={`wp-input ${errors.desconto ? 'wp-input-error' : ''}`}
            placeholder="Ex: 10% nos serviços"
            {...register("desconto", { required: "O desconto é obrigatório" })}
          />
          {errors.desconto && <p className="wp-error-message">{errors.desconto.message}</p>}
        </div>

        <div className="col-span-2">
          <label htmlFor="produtos" className="wp-label">Produtos/Serviços Oferecidos</label>
          <textarea 
            id="produtos" 
            className={`wp-input ${errors.produtos ? 'wp-input-error' : ''}`}
            placeholder="Descreva os principais produtos e serviços oferecidos"
            {...register("produtos", { required: "A descrição dos produtos/serviços é obrigatória" })}
          />
          {errors.produtos && <p className="wp-error-message">{errors.produtos.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default EmpresaNichoInfo;
