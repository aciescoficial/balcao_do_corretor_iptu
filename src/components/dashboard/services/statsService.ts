
import { supabase } from '@/integrations/supabase/client';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { toast } from '@/components/ui/use-toast';

export interface DashboardStats {
  associados: number;
  empresas: number;
  pendentes: number;
  carteirasPendentes: number;
}

/**
 * Fetches statistics data for the dashboard with improved timeout handling
 * @param retries Number of retry attempts
 */
export const fetchDashboardStats = async (retries = 1): Promise<DashboardStats> => {
  try {
    // Default values in case of errors
    const defaultStats: DashboardStats = {
      associados: 0,
      empresas: 0,
      pendentes: 0,
      carteirasPendentes: 0
    };
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      return defaultStats;
    }

    console.log('Authenticated user found, fetching dashboard stats');
    
    // Use a slightly longer timeout to improve chances of successful response
    const timeoutPromise = new Promise<DashboardStats>((resolve) => {
      setTimeout(() => {
        console.log('Stats query timed out, using default values');
        resolve(defaultStats);
      }, 3500); // Increased from 1500ms to 3500ms
    });
    
    // Create the actual data fetching promise
    const dataPromise = (async () => {
      try {
        // Execute all queries in parallel for better performance
        const [
          associadosResult, 
          empresasResult, 
          pendentesAssociadosResult,
          pendentesEmpresasResult,
          carteirasResult
        ] = await Promise.all([
          // Use extendedSupabase client to bypass RLS for more reliable count
          extendedSupabase.from('associados').select('*', { count: 'exact', head: true }),
          
          // Fetch empresas count
          extendedSupabase.from('empresas').select('*', { count: 'exact', head: true }),
          
          // Fetch pending associados count
          extendedSupabase.from('associados')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente'),
            
          // Fetch pending empresas count - explicitly match 'pendente' status
          extendedSupabase.from('empresas')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente'),
            
          // Fetch pending carteirinhas count
          extendedSupabase.from('carteirinha_solicitacoes')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente_pagamento')
        ]);
        
        // Log detailed information to help troubleshoot
        console.log('Raw counts from DB:', {
          associados: associadosResult.count,
          empresas: empresasResult.count,
          pendentesAssociados: pendentesAssociadosResult.count,
          pendentesEmpresas: pendentesEmpresasResult.count,
          carteiras: carteirasResult.count
        });
        
        // Make sure we handle null counts properly
        const pendingAssociadosCount = pendentesAssociadosResult.count || 0;
        const pendingEmpresasCount = pendentesEmpresasResult.count || 0;
        
        // Calculate total pending items (associados + empresas)
        const totalPendentes = pendingAssociadosCount + pendingEmpresasCount;

        console.log('Stats calculation:', {
          associados: associadosResult.count || 0,
          empresas: empresasResult.count || 0,
          pendentesAssociados: pendingAssociadosCount,
          pendentesEmpresas: pendingEmpresasCount,
          totalPendentes,
          carteiras: carteirasResult.count || 0
        });

        return {
          associados: associadosResult.count || 0,
          empresas: empresasResult.count || 0,
          pendentes: totalPendentes,
          carteirasPendentes: carteirasResult.count || 0
        };
      } catch (error) {
        console.error('Error in data fetching promise:', error);
        return defaultStats;
      }
    })();

    // Race between actual data and timeout
    return await Promise.race([dataPromise, timeoutPromise]);
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    if (retries > 0) {
      console.log(`Retrying fetchDashboardStats (${retries} attempts remaining)...`);
      return fetchDashboardStats(retries - 1);
    }
    toast({
      title: "Erro ao carregar estatísticas",
      description: "Tente atualizar a página",
      variant: "destructive"
    });
    return {
      associados: 0,
      empresas: 0,
      pendentes: 0,
      carteirasPendentes: 0
    };
  }
};
