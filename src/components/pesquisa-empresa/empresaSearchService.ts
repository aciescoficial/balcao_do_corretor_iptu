
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmpresaData } from './types';
import { useTimeout } from '@/components/dashboard/hooks/useTimeout';

export const useEmpresaSearch = () => {
  const { toast } = useToast();
  const { withTimeout } = useTimeout<EmpresaData[]>(30000, []);

  const searchNearbyCompanies = async (latitude: number, longitude: number, radius: number = 10) => {
    try {
      const searchPromise = new Promise<EmpresaData[]>(async (resolve, reject) => {
        try {
          const { data, error } = await supabase
            .from('empresas')
            .select('*')
            .eq('status', 'ativo');
          
          if (error) throw error;
          
          const nearbyCompanies = data.map(company => ({
            ...company,
            latitude: latitude + (Math.random() - 0.5) * 0.05,
            longitude: longitude + (Math.random() - 0.5) * 0.05
          })) as EmpresaData[];
          
          resolve(nearbyCompanies);
        } catch (error) {
          reject(error);
        }
      });

      const results = await withTimeout(searchPromise);
      
      if (results.length === 0) {
        toast({
          title: "Nenhuma empresa encontrada",
          description: "Não foram encontradas empresas ativas próximas à sua localização.",
        });
      }
      
      return results;
    } catch (error: any) {
      console.error("Error searching nearby companies:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
      return [];
    }
  };

  const searchByTerm = async (searchType: 'nome' | 'cnpj' | 'nicho', searchTerm: string) => {
    try {
      const searchPromise = new Promise<EmpresaData[]>(async (resolve, reject) => {
        try {
          let query = supabase
            .from('empresas')
            .select('*')
            .eq('status', 'ativo');
          
          if (searchType === 'nome') {
            query = query.or(`nome_fantasia.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%`);
          } else if (searchType === 'cnpj') {
            query = query.ilike('cnpj', `%${searchTerm}%`);
          } else if (searchType === 'nicho') {
            query = query.ilike('nicho', `%${searchTerm}%`);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            const companiesWithCoords = data.map(company => ({
              ...company,
              latitude: -15.7801 + (Math.random() - 0.5) * 0.1,
              longitude: -47.9292 + (Math.random() - 0.5) * 0.1
            })) as EmpresaData[];
            resolve(companiesWithCoords);
          } else {
            resolve([]);
          }
        } catch (error) {
          reject(error);
        }
      });

      const results = await withTimeout(searchPromise);
      
      if (results.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas ativas com os critérios informados.",
        });
      }
      
      return results;
    } catch (error: any) {
      console.error("Error searching data:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
      return [];
    }
  };

  return { searchNearbyCompanies, searchByTerm };
};
