
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, Building, ClipboardCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-left">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link to="/associados/cadastro" className="w-full block">
          <Button className="w-full justify-start" variant="default">
            <UserPlus size={18} className="mr-2" />
            Cadastrar Novo Associado
          </Button>
        </Link>
        <Link to="/empresas/cadastrar" className="w-full block">
          <Button className="w-full justify-start" variant="outline">
            <Building size={18} className="mr-2" />
            Cadastrar Nova Empresa
          </Button>
        </Link>
        <Link to="/associados/pendentes" className="w-full block">
          <Button className="w-full justify-start" variant="outline">
            <ClipboardCheck size={18} className="mr-2" />
            Gerenciar Aprovações Pendentes
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
