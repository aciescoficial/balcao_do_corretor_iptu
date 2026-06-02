
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CreditCard, ExternalLink } from 'lucide-react';
import { verificarSituacaoPagamento } from '../services/pagamentoService';
import { SituacaoPagamento } from '../types/pagamentos';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatarData = (data: string) => {
  if (!data) return '';
  return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

const SituacaoPagamentoCard: React.FC = () => {
  const { user } = useAuth();
  const [situacao, setSituacao] = useState<SituacaoPagamento>({ emDia: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificarPagamento = async () => {
      if (!user?.associado_id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const situacaoPagamento = await verificarSituacaoPagamento(user.associado_id);
        setSituacao(situacaoPagamento);
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    verificarPagamento();
  }, [user]);

  return (
    <Card className={`${situacao.emDia ? 'border-green-500 border-2' : 'border-yellow-500 border-2'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Situação da Anuidade</span>
          {!isLoading && (
            <Badge className={`${situacao.emDia ? 'bg-green-500' : 'bg-yellow-500'}`}>
              {situacao.emDia ? 'Em Dia' : 'Pendente'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {situacao.ultimoPagamento ? (
                    <>Último pagamento: {formatarData(situacao.ultimoPagamento.data_pagamento)}</>
                  ) : (
                    <>Nenhum pagamento registrado</>
                  )}
                </span>
              </div>
              
              {situacao.proximoVencimento && (
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Próximo vencimento: {formatarData(situacao.proximoVencimento)}
                  </span>
                </div>
              )}
            </div>
            
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/meus-pagamentos" className="flex items-center justify-center">
                <span>Ver detalhes</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SituacaoPagamentoCard;
