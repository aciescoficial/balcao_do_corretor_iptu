import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SituacaoPagamentoCard from '@/components/associado/dashboard/SituacaoPagamentoCard';
import UltimasEmpresas from '@/components/associado/dashboard/UltimasEmpresas';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { verificarSituacaoPagamento } from '@/components/associado/services/pagamentoService';
import { SituacaoPagamento } from '@/components/associado/types/pagamentos';
import { useAuth } from '@/components/auth/AuthProvider';

const AssociadoDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pagamentoStatus, setPagamentoStatus] = useState<SituacaoPagamento | null>(null);
  const [loadingPagamento, setLoadingPagamento] = useState<boolean>(false);
  
  useEffect(() => {
    const checkPagamento = async () => {
      if (user?.associado_id) {
        try {
          setLoadingPagamento(true);
          const status = await verificarSituacaoPagamento(user.associado_id);
          setPagamentoStatus(status);
        } catch (error) {
          console.error("Error checking payment status:", error);
        } finally {
          setLoadingPagamento(false);
        }
      }
    };
    
    checkPagamento();
  }, [user]);

  if (loadingPagamento) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="Verificando status de pagamento..." />
      </div>
    );
  }

  if (!pagamentoStatus?.emDia) {
    return (
      <div className="space-y-6">
        <h1 className="wp-header">Área do Associado</h1>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h2 className="text-amber-800 font-medium text-lg mb-2">Atenção! Pagamento Pendente</h2>
          <p className="text-amber-700 mb-2">
            Para acessar todas as funcionalidades do sistema, é necessário regularizar o pagamento da sua anuidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              onClick={() => window.location.href = '/meus-pagamentos'}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Ver meus pagamentos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/perfil/atualizar'}
            >
              Atualizar meus dados
            </Button>
          </div>
        </div>
        
        <SituacaoPagamentoCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SituacaoPagamentoCard />
        <UltimasEmpresas />
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Todas as Empresas Conveniadas</h2>
        <iframe 
          src="/empresas-conveniadas" 
          className="w-full h-[600px] border-0 rounded-lg shadow-sm" 
          title="Empresas Conveniadas"
        />
      </div>
    </div>
  );
};

export default AssociadoDashboard;
