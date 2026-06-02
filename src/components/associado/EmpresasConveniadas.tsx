
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEmpresasConveniadas } from './services/empresasService';
import { Empresa } from './types/empresa';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const EmpresasConveniadas: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        setLoading(true);
        const data = await getEmpresasConveniadas();
        setEmpresas(data);
      } catch (error) {
        console.error("Erro ao carregar empresas conveniadas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEmpresas();
  }, []);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Empresas Conveniadas</CardTitle>
          <CardDescription>Confira as empresas parceiras</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Empresas Conveniadas</CardTitle>
        <CardDescription>Confira as empresas parceiras e aproveite os descontos</CardDescription>
      </CardHeader>
      <CardContent>
        {empresas.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma empresa conveniada encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {empresas.slice(0, 4).map((empresa) => (
              <div key={empresa.id} className="border rounded-lg p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium truncate">{empresa.nome_fantasia}</h3>
                  {empresa.status === 'ativo' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {empresa.produtos}
                </p>
                <div className="mt-auto pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex items-center gap-1"
                    onClick={() => window.open(`/empresas/${empresa.id}`, '_blank')}
                  >
                    <ExternalLink size={14} />
                    <span>Ver detalhes</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {empresas.length > 4 && (
          <div className="text-center mt-4">
            <Button 
              variant="link" 
              onClick={() => window.open('/empresas-conveniadas', '_blank')}
            >
              Ver todas as {empresas.length} empresas conveniadas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmpresasConveniadas;
