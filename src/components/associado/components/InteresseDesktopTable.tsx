
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, X, Eye, CheckCircle2 } from 'lucide-react';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { useDialogState } from '@/components/usuarios/hooks/useDialogState';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface InteresseDesktopTableProps {
  interesses: AssociadoInteresse[];
  onApprove: (interesse: AssociadoInteresse) => void;
  onReject: (id: string) => void;
}

interface InteresseDetailsProps {
  interesse: AssociadoInteresse;
}

const InteresseDetails: React.FC<InteresseDetailsProps> = ({ interesse }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
          <p>{interesse.nome} {interesse.sobrenome}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p>{interesse.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">CPF</h3>
          <p>{interesse.cpf}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Celular</h3>
          <p>{interesse.celular}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Cidade/Estado</h3>
          <p>{interesse.cidade}/{interesse.estado}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">CRECI</h3>
          <p>{interesse.creci || 'Não informado'}</p>
        </div>
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

const InteresseDesktopTable: React.FC<InteresseDesktopTableProps> = ({ 
  interesses, 
  onApprove, 
  onReject 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>CRECI</TableHead>
          <TableHead className="text-center">Detalhes</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interesses.map((interesse) => {
          const isApproved = interesse.status === 'aprovado';
          
          return (
            <TableRow key={interesse.id}>
              <TableCell className="font-medium">
                {interesse.nome} {interesse.sobrenome}
              </TableCell>
              <TableCell>{interesse.cpf}</TableCell>
              <TableCell>
                {interesse.creci || (
                  <span className="text-gray-400 italic">Não informado</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes do Interesse</DialogTitle>
                          </DialogHeader>
                          <InteresseDetails interesse={interesse} />
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver detalhes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  {isApproved ? (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 flex items-center"
                      disabled
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Já Aprovado
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onApprove(interesse)}
                        className="flex items-center"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReject(interesse.id)}
                        className="flex items-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default InteresseDesktopTable;
