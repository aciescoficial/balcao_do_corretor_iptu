
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Search, CheckCircle2 } from 'lucide-react';

interface AprovacaoAlertasProps {
  showInstructions?: boolean;
}

const AprovacaoAlertas: React.FC<AprovacaoAlertasProps> = ({ showInstructions = true }) => {
  return (
    <>
      {showInstructions && (
        <div className="space-y-3">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Instruções</AlertTitle>
            <AlertDescription>
              Avalie cada solicitação de interesse. Ao aprovar, será enviado um email com link para cadastro.
              Solicitações já aprovadas serão marcadas como "Já Aprovado".
            </AlertDescription>
          </Alert>
          
          <Alert variant="default" className="bg-gray-50 border-gray-200">
            <Search className="h-4 w-4" />
            <AlertTitle>Dicas de Pesquisa</AlertTitle>
            <AlertDescription>
              Use os filtros acima para encontrar interesses por status, nome ou email. 
              Você pode alternar entre visualizar pendentes, aprovados ou rejeitados.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default AprovacaoAlertas;
