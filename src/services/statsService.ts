
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from './baseService';

export interface DashboardStats {
  associados: number;
  empresas: number;
  pendentes: number;
  carteirasPendentes: number;
}

class StatsService extends BaseService {
  async fetchDashboardStats(): Promise<DashboardStats> {
    try {
      this.logInfo("Fetching dashboard stats");
      
      const [
        associadosResult, 
        empresasResult, 
        pendentesAssociadosResult,
        pendentesEmpresasResult,
        carteirasResult
      ] = await Promise.all([
        supabase.from('associados').select('*', { count: 'exact', head: true }),
        supabase.from('empresas').select('*', { count: 'exact', head: true }),
        supabase.from('associados').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase.from('empresas').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase.from('carteirinha_solicitacoes').select('*', { count: 'exact', head: true }).eq('status', 'pendente_pagamento')
      ]);
      
      const stats: DashboardStats = {
        associados: associadosResult.count || 0,
        empresas: empresasResult.count || 0,
        pendentes: (pendentesAssociadosResult.count || 0) + (pendentesEmpresasResult.count || 0),
        carteirasPendentes: carteirasResult.count || 0
      };

      this.logInfo("Dashboard stats fetched", stats);
      return stats;
    } catch (error) {
      const errorMessage = "Erro ao buscar estatísticas do dashboard";
      this.handleError(error, errorMessage);
      // Return default stats on error to maintain type safety
      return {
        associados: 0,
        empresas: 0,
        pendentes: 0,
        carteirasPendentes: 0
      };
    }
  }
}

export const statsService = new StatsService();
