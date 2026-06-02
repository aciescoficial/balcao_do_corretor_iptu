
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserCheck, UserX, Clock, MapPin } from 'lucide-react';
import { Associado, AssociadoStatus } from './types';

interface AssociadoCardProps {
  associado: Associado;
}

const AssociadoCard: React.FC<AssociadoCardProps> = ({ associado }) => {
  const getStatusBadge = (status: AssociadoStatus) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><UserCheck className="h-3 w-3 mr-1" />Ativo</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'inativo':
        return <Badge variant="destructive"><UserX className="h-3 w-3 mr-1" />Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card key={associado.id} className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3"></div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden border-2 border-gray-200">
            {associado.avatar_url ? (
              <img 
                src={associado.avatar_url} 
                alt={`${associado.nome}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                Sem foto
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {associado.nome} {associado.sobrenome}
              </h3>
              <div className="ml-2">
                {getStatusBadge(associado.status)}
              </div>
            </div>
            
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">CPF:</span> {associado.cpf}
              </p>
              {associado.creci && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">CRECI:</span> {associado.creci}
                </p>
              )}
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={14} className="mr-1" />
                {associado.cidade}
              </div>
            </div>
            
            <div className="mt-3 flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs">Ver Detalhes</Button>
              <Button size="sm" variant="default" className="text-xs">Gerar Carteirinha</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociadoCard;
