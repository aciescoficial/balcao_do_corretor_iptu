
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface RecentActivity {
  type: 'associado' | 'empresa';
  name: string;
  action: string;
  date: string;
}

/**
 * Fetches recent activity data for the dashboard
 * @param retries Number of retry attempts
 */
export const fetchRecentActivity = async (retries = 1): Promise<RecentActivity[]> => {
  try {
    // Default empty array in case of errors
    const defaultActivity: RecentActivity[] = [];
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      return defaultActivity;
    }

    console.log('Authenticated user found, fetching recent activity');
    
    // Use Promise.race with a timeout
    const timeoutPromise = new Promise<RecentActivity[]>((resolve) => {
      setTimeout(() => {
        console.log('Activity query timed out, using default values');
        resolve(defaultActivity);
      }, 3500); // Increased from 2000ms to 3500ms
    });
    
    // Create the actual data fetching promise
    const dataPromise = (async () => {
      try {
        // Execute queries in parallel for better performance
        const [recentAssociadosResult, recentEmpresasResult] = await Promise.all([
          // Fetch recent associados
          supabase
            .from('associados')
            .select('nome, sobrenome, status, created_at')
            .order('created_at', { ascending: false })
            .limit(3),
            
          // Fetch recent empresas
          supabase
            .from('empresas')
            .select('nome_fantasia, status, created_at')
            .order('created_at', { ascending: false })
            .limit(3)
        ]);
        
        const recentAssociados = recentAssociadosResult.data || [];
        const recentEmpresas = recentEmpresasResult.data || [];

        console.log('Activity query results:', {
          associados: recentAssociados.length,
          empresas: recentEmpresas.length
        });

        // Combine and format recent activity
        const formattedActivity = [
          ...recentAssociados.map(item => ({
            type: 'associado' as const,
            name: `${item.nome} ${item.sobrenome}`,
            action: item.status === 'pendente' ? 'pendente' : 'cadastrado',
            date: new Date(item.created_at).toLocaleDateString()
          })),
          ...recentEmpresas.map(item => ({
            type: 'empresa' as const,
            name: item.nome_fantasia,
            action: item.status === 'pendente' ? 'pendente' : 'conveniada',
            date: new Date(item.created_at).toLocaleDateString()
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4); // Get only the 4 most recent activities
        
        return formattedActivity;
      } catch (error) {
        console.error('Error in activity data promise:', error);
        return defaultActivity;
      }
    })();

    // Race between actual data and timeout
    return await Promise.race([dataPromise, timeoutPromise]);
    
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    if (retries > 0) {
      console.log(`Retrying fetchRecentActivity (${retries} attempts remaining)...`);
      return fetchRecentActivity(retries - 1);
    }
    toast({
      title: "Erro ao carregar atividades recentes",
      description: "Tente atualizar a página",
      variant: "destructive"
    });
    return [];
  }
};
