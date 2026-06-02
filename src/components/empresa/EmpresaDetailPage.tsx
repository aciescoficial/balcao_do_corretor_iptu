
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { empresaService } from './services/empresaService';
import { EmpresaData } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Phone, Mail, Globe, Instagram, MessageCircle, CalendarRange, Tag } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmpresaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [empresa, setEmpresa] = useState<EmpresaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        if (!id) return;
        
        setLoading(true);
        const data = await empresaService.getEmpresaById(id);
        setEmpresa(mapToEmpresaData(data));
      } catch (error) {
        console.error("Error fetching company details:", error);
        toast({
          title: "Erro ao carregar detalhes",
          description: "Não foi possível obter os dados da empresa.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [id, toast]);

  const mapToEmpresaData = (data: any): EmpresaData => ({
    id: data.id,
    razao_social: data.razao_social,
    nome_fantasia: data.nome_fantasia,
    cnpj: data.cnpj,
    responsavel: data.responsavel,
    telefone: data.telefone,
    email: data.email,
    cidade: data.cidade,
    nicho: data.nicho,
    status: data.status,
    latitude: data.latitude,
    longitude: data.longitude,
    endereco: data.endereco,
    cep: data.cep,
    logo_url: data.logo_url,
    site: data.site,
    instagram: data.instagram,
    whatsapp: data.whatsapp,
    desconto: data.desconto,
    produtos: data.produtos,
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Ativo</span>;
      case 'pendente':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendente</span>;
      case 'inativo':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inativo</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="wp-header">Detalhes da Empresa</h1>
        <div className="h-96 flex items-center justify-center">
          <LoadingSpinner text="Carregando detalhes da empresa..." />
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="space-y-6">
        <h1 className="wp-header">Detalhes da Empresa</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Empresa não encontrada</p>
              <Button onClick={() => navigate('/empresas/pesquisar')} variant="outline" className="mt-4">
                Voltar para pesquisa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">{empresa.nome_fantasia}</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/empresas/pesquisar')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            size="sm" 
            asChild
            className="flex items-center gap-2"
          >
            <Link to={`/empresas/editar/${empresa.id}`}>
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" /> 
                  Dados Gerais
                </div>
                <div>
                  {renderStatusBadge(empresa.status)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome Fantasia</p>
                  <p>{empresa.nome_fantasia}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Razão Social</p>
                  <p>{empresa.razao_social}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                  <p>{empresa.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                  <p>{empresa.responsavel}</p>
                </div>
              </div>

              <div className="pt-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Tag className="h-4 w-4 mr-2" /> Nicho
                </p>
                <p>{empresa.nicho}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2" /> 
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                <p>{empresa.endereco}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                  <p>{empresa.cidade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CEP</p>
                  <p>{empresa.cep}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Phone className="h-5 w-5 text-muted-foreground mr-2" /> 
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" /> Email
                </p>
                <p>{empresa.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center">
                  <Phone className="h-4 w-4 mr-2" /> Telefone
                </p>
                <p>{empresa.telefone}</p>
              </div>
              {empresa.whatsapp && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                  </p>
                  <p>{empresa.whatsapp}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Globe className="h-5 w-5 text-muted-foreground mr-2" /> 
                Presença digital
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {empresa.site && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <Globe className="h-4 w-4 mr-2" /> Site
                  </p>
                  <p className="break-all">
                    <a 
                      href={empresa.site.startsWith('http') ? empresa.site : `https://${empresa.site}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {empresa.site}
                    </a>
                  </p>
                </div>
              )}
              {empresa.instagram && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center">
                    <Instagram className="h-4 w-4 mr-2" /> Instagram
                  </p>
                  <p className="break-all">
                    <a 
                      href={`https://instagram.com/${empresa.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {empresa.instagram}
                    </a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CalendarRange className="h-5 w-5 text-muted-foreground mr-2" /> 
                Benefícios para Associados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Desconto oferecido</p>
                <p>{empresa.desconto || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Produtos/Serviços</p>
                <p>{empresa.produtos || "Não informado"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmpresaDetailPage;
