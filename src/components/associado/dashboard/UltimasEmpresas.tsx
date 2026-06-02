
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, ChevronRight } from 'lucide-react';
import { EmpresaConveniada, buscarUltimasEmpresas } from '../services/empresasService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UltimasEmpresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<EmpresaConveniada[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        setIsLoading(true);
        const dados = await buscarUltimasEmpresas(3);
        setEmpresas(dados);
      } catch (error) {
        console.error('Erro ao carregar últimas empresas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarEmpresas();
  }, []);

  // Função para obter as iniciais do nome da empresa
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          Últimas Empresas Conveniadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : empresas.length > 0 ? (
          <>
            {empresas.map(empresa => (
              <div key={empresa.id} className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={empresa.logo_url} alt={empresa.nome_fantasia} />
                  <AvatarFallback className="bg-aciesc-primary text-white">
                    {getInitials(empresa.nome_fantasia)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{empresa.nome_fantasia}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {empresa.desconto} de desconto • {empresa.cidade}
                  </p>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2" 
              asChild
            >
              <Link to="/empresas-conveniadas" className="flex items-center justify-center">
                <span>Ver todas</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Building className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Ainda não há empresas conveniadas cadastradas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UltimasEmpresas;
