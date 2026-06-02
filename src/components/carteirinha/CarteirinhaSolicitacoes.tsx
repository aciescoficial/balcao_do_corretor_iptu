import React, { useState, useEffect } from 'react';
import { useSolicitacoes } from './hooks/useSolicitacoes';
import { SolicitacoesSearch } from './components/SolicitacoesSearch';
import { SolicitacoesTable } from './components/SolicitacoesTable';
import { SolicitacoesPagination } from './components/SolicitacoesPagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Printer, 
  Package, 
  CheckCircle, 
  AlertTriangle
} from 'lucide-react';
import { SolicitacaoEditDialog } from './components/SolicitacaoEditDialog';
import { verifyCarteirinhaPayment } from './services/carteirinhaService';
import { useToast } from '@/hooks/use-toast';

const CarteirinhaSolicitacoes: React.FC = () => {
  const {
    solicitacoes,
    isLoading,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleSearch,
    handlePageChange,
    updateSolicitacao,
    fetchSolicitacoes
  } = useSolicitacoes();

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditClick = (solicitacao: any) => {
    setSelectedSolicitacao(solicitacao);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedSolicitacao(null);
  };

  const handleStatusUpdate = async (id: string, newStatus: string, observacoes?: string, codigoRastreio?: string) => {
    const success = await updateSolicitacao(id, { 
      status: newStatus,
      observacoes: observacoes || undefined,
      codigo_rastreio: codigoRastreio || undefined
    });
    
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedSolicitacao(null);
    }
  };

  const checkPendingPayments = async () => {
    const pendingPaymentSolicitacoes = solicitacoes.filter(s => s.status === 'pendente_pagamento');
    
    for (const solicitacao of pendingPaymentSolicitacoes) {
      try {
        const { paid, status } = await verifyCarteirinhaPayment(solicitacao.id);
        
        if (paid && status !== solicitacao.status) {
          toast({
            title: "Pagamento confirmado",
            description: `Pagamento da solicitação #${solicitacao.id.substring(0, 8)} foi confirmado.`,
          });
          
          fetchSolicitacoes();
          break;
        }
      } catch (error) {
        console.error(`Erro ao verificar pagamento para solicitação ${solicitacao.id}:`, error);
      }
    }
  };

  useEffect(() => {
    if (solicitacoes.some(s => s.status === 'pendente_pagamento')) {
      checkPendingPayments();
      
      const interval = setInterval(() => {
        checkPendingPayments();
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [solicitacoes]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendentes" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" /> Pagamento Pendente
          </TabsTrigger>
          <TabsTrigger value="aguardando" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Aguardando Produção
          </TabsTrigger>
          <TabsTrigger value="producao" className="flex items-center gap-1">
            <Printer className="h-4 w-4" /> Em Produção
          </TabsTrigger>
          <TabsTrigger value="entrega" className="flex items-center gap-1">
            <Package className="h-4 w-4" /> Prontas para Entrega
          </TabsTrigger>
          <TabsTrigger value="concluidas" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Concluídas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Solicitações</CardTitle>
              <CardDescription>Lista completa de solicitações de carteirinhas</CardDescription>
            </CardHeader>
            <CardContent>
              <SolicitacoesSearch 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                handleSearch={handleSearch}
              />
              
              <SolicitacoesTable 
                solicitacoes={solicitacoes}
                isLoading={isLoading}
                onEdit={handleEditClick}
              />
              
              <SolicitacoesPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Pagamento Pendente
              </CardTitle>
              <CardDescription>Solicitações aguardando confirmação de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <SolicitacoesTable 
                solicitacoes={solicitacoes.filter(s => s.status === 'pendente_pagamento')}
                isLoading={isLoading}
                onEdit={handleEditClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aguardando">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Aguardando Produção
              </CardTitle>
              <CardDescription>Solicitações com pagamento confirmado, aguardando início da produção</CardDescription>
            </CardHeader>
            <CardContent>
              <SolicitacoesTable 
                solicitacoes={solicitacoes.filter(s => s.status === 'aguardando_producao')}
                isLoading={isLoading}
                onEdit={handleEditClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="producao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-blue-500" />
                Em Produção
              </CardTitle>
              <CardDescription>Carteirinhas sendo produzidas na gráfica</CardDescription>
            </CardHeader>
            <CardContent>
              <SolicitacoesTable 
                solicitacoes={solicitacoes.filter(s => s.status === 'em_producao')}
                isLoading={isLoading}
                onEdit={handleEditClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entrega">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                Prontas para Entrega
              </CardTitle>
              <CardDescription>Carteirinhas produzidas e prontas para entrega ou retirada</CardDescription>
            </CardHeader>
            <CardContent>
              <SolicitacoesTable 
                solicitacoes={solicitacoes.filter(s => s.status === 'pronta_entrega')}
                isLoading={isLoading}
                onEdit={handleEditClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concluidas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Concluídas
              </CardTitle>
              <CardDescription>Carteirinhas entregues aos associados</CardDescription>
            </CardHeader>
            <CardContent>
              <SolicitacoesTable 
                solicitacoes={solicitacoes.filter(s => s.status === 'concluida')}
                isLoading={isLoading}
                onEdit={handleEditClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedSolicitacao && (
        <SolicitacaoEditDialog 
          solicitacao={selectedSolicitacao}
          onUpdate={updateSolicitacao}
          onSuccess={fetchSolicitacoes}
        />
      )}
    </div>
  );
};

export default CarteirinhaSolicitacoes;
