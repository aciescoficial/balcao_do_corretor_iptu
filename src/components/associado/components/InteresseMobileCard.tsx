
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, X, Eye } from 'lucide-react';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';

interface InteresseMobileCardProps {
  interesse: AssociadoInteresse;
  onApprove: (interesse: AssociadoInteresse) => void;
  onReject: (id: string) => void;
}

interface InteresseDetailsProps {
  interesse: AssociadoInteresse;
}

const InteresseDetails: React.FC<InteresseDetailsProps> = ({ interesse }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
        <p>{interesse.nome} {interesse.sobrenome}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">Email</h3>
        <p>{interesse.email}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">CPF</h3>
        <p>{interesse.cpf}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">Celular</h3>
        <p>{interesse.celular}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">Cidade/Estado</h3>
        <p>{interesse.cidade}/{interesse.estado}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">CRECI</h3>
        <p>{interesse.creci || 'Não informado'}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">Data de Interesse</h3>
        <p>{new Date(interesse.created_at).toLocaleDateString('pt-BR')}</p>
      </div>
      
      {interesse.motivo_interesse && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Motivo do Interesse</h3>
          <p>{interesse.motivo_interesse}</p>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-medium text-gray-500">Status de Pagamento</h3>
        <p className={interesse.pagamento_confirmado ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
          {interesse.pagamento_confirmado ? 'Confirmado' : 'Pendente'}
        </p>
      </div>
    </div>
  );
};

const InteresseMobileCard: React.FC<InteresseMobileCardProps> = ({ 
  interesse, 
  onApprove, 
  onReject 
}) => {
  const isApproved = interesse.status === 'aprovado';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-base">
            {interesse.nome} {interesse.sobrenome}
          </h3>
          <p className="text-sm text-gray-500 mt-1">CPF: {interesse.cpf}</p>
          {interesse.creci && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              CRECI: {interesse.creci}
            </span>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          interesse.pagamento_confirmado 
            ? 'bg-green-100 text-green-800' 
            : 'bg-amber-100 text-amber-800'
        }`}>
          {interesse.pagamento_confirmado ? 'Pago' : 'Pendente'}
        </span>
      </div>
      
      <div className="mt-4 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              Ver Detalhes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Interesse</DialogTitle>
            </DialogHeader>
            <InteresseDetails interesse={interesse} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex gap-2 mt-2">
        {isApproved ? (
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled
          >
            Já Aprovado
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onApprove(interesse)}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Aprovar
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(interesse.id)}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Rejeitar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InteresseMobileCard;
