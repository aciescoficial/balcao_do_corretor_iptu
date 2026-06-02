
import React from 'react';
import { Building, Info } from 'lucide-react';

const CadastroHeader = () => {
  return (
    <>
      <h1 className="wp-header flex items-center gap-2">
        <Building className="h-6 w-6" />
        Cadastro de Empresas
      </h1>

      <div className="wp-notice-info flex items-start mb-4">
        <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Processo de aprovação</p>
          <p className="text-sm">Após o cadastro, a empresa ficará com status pendente até que um administrador aprove os dados enviados.</p>
        </div>
      </div>
    </>
  );
};

export default CadastroHeader;
