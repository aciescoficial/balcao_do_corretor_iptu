import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Building, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';

const EmpresasDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleEditarCadastro = () => {
    // Navegar para a página de edição da empresa
    if (user?.empresa_id) {
      navigate(`/empresas/editar/${user.empresa_id}`);
    } else {
      navigate('/empresas/cadastro');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Área da Empresa</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Gerenciar Cadastro
            </CardTitle>
            <CardDescription>
              Atualize os dados da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Mantenha seus dados sempre atualizados para que os associados possam encontrar 
              informações corretas da sua empresa.
            </p>
            <Button 
              onClick={handleEditarCadastro}
              className="w-full flex items-center gap-2"
            >
              <Pencil size={18} />
              Editar Cadastro
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Benefícios da Parceria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 p-2 rounded-full">
                <Building size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Visibilidade</h3>
                <p className="text-sm text-muted-foreground">
                  Sua empresa aparece para todos os associados na plataforma.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-2 rounded-full">
                <Info size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Comunicação</h3>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações e comunicados importantes da associação.
                </p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/empresas/beneficios')}>
              Ver todos os benefícios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresasDashboard;
