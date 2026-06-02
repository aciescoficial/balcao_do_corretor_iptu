
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Pagamento, SituacaoPagamento } from './types/pagamentos';
import { obterPagamentosAssociado, verificarSituacaoPagamento } from './services/pagamentoService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, CreditCard, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const formatarData = (data: string) => {
  return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
};

const PagamentosAssociadoPage: React.FC = () => {
  const { user } = useAuth();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [situacao, setSituacao] = useState<SituacaoPagamento>({ emDia: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        // Verifica se o usuário tem um associado_id
        if (user?.associado_id) {
          const listaPagamentos = await obterPagamentosAssociado(user.associado_id);
          const situacaoPagamento = await verificarSituacaoPagamento(user.associado_id);
          
          setPagamentos(listaPagamentos);
          setSituacao(situacaoPagamento);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de pagamentos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarDados();
  }, [user]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'atrasado':
        return <Badge className="bg-red-500">Atrasado</Badge>;
      case 'cancelado':
        return <Badge className="bg-gray-500">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Meus Pagamentos</h1>
      
      {/* Card de Situação do Pagamento */}
      <Card className={`p-6 ${situacao.emDia ? 'border-green-500 border-2' : 'border-yellow-500 border-2'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Situação da Anuidade</h2>
            <div className="space-y-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <CalendarCheck size={18} className="mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {situacao.ultimoPagamento ? (
                        <>Último pagamento: {formatarData(situacao.ultimoPagamento.data_pagamento)}</>
                      ) : (
                        <>Nenhum pagamento registrado</>
                      )}
                    </span>
                  </div>
                  {situacao.proximoVencimento && (
                    <div className="flex items-center">
                      <Clock size={18} className="mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Próximo vencimento: {formatarData(situacao.proximoVencimento)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="text-right">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : situacao.emDia ? (
              <Badge className="bg-green-500 text-lg">Em Dia</Badge>
            ) : (
              <Badge className="bg-yellow-500 text-lg">Pendente</Badge>
            )}
            
            {!isLoading && situacao.diasRestantes !== undefined && situacao.diasRestantes > 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                Faltam {situacao.diasRestantes} dia(s) para vencer
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Histórico de Pagamentos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Histórico de Pagamentos</h2>
        
        {isLoading ? (
          <>
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </>
        ) : pagamentos.length > 0 ? (
          pagamentos.map(pagamento => (
            <Card key={pagamento.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">
                    Anuidade {pagamento.ano_referencia}
                  </h3>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <CreditCard size={16} className="mr-1" />
                    <span>{pagamento.metodo || 'Não especificado'} • {formatarData(pagamento.data_pagamento)}</span>
                  </div>
                  {pagamento.descricao && (
                    <p className="text-sm mt-1">{pagamento.descricao}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {formatarMoeda(pagamento.valor)}
                  </div>
                  <div className="mt-1">
                    {renderStatusBadge(pagamento.status)}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 flex flex-col items-center justify-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <p className="text-center text-muted-foreground">
              Nenhum pagamento encontrado no seu histórico.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PagamentosAssociadoPage;
