
import React from 'react';
import AssociadoForm from './associado/AssociadoForm';
import { ImportExportAssociado } from './associado/ImportExportAssociado';

const CadastroAssociado: React.FC = () => {
  return (
    <div className="space-y-6 w-full max-w-full">
      <h1 className="wp-header">Cadastrar Associado</h1>
      
      <div className="wp-card w-full max-w-full">
        <AssociadoForm />
        <div className="mt-8 pt-6 border-t">
          <ImportExportAssociado />
        </div>
      </div>
    </div>
  );
};

export default CadastroAssociado;
