
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaData } from '@/components/empresa/types';
import { CompanySearchFormValues } from '@/components/empresa/components/search/schema';
import { handleError } from '@/utils/errorHandling';

export const useCompanyQuery = (searchParams: CompanySearchFormValues | null) => {
  return useQuery({
    queryKey: ['companies', searchParams],
    queryFn: async () => {
      if (!searchParams) return [];

      try {
        let query = supabase
          .from('empresas')
          .select('*');

        if (searchParams.status !== 'todos') {
          query = query.eq('status', searchParams.status);
        }

        if (searchParams.searchTerm && searchParams.searchTerm.trim() !== '') {
          if (searchParams.searchType === 'nome') {
            query = query.or(`nome_fantasia.ilike.%${searchParams.searchTerm}%,razao_social.ilike.%${searchParams.searchTerm}%`);
          } else if (searchParams.searchType === 'cnpj') {
            query = query.ilike('cnpj', `%${searchParams.searchTerm}%`);
          } else if (searchParams.searchType === 'nicho') {
            query = query.ilike('nicho', `%${searchParams.searchTerm}%`);
          }
        }

        const { data, error } = await query;

        if (error) throw error;

        return data as EmpresaData[];
      } catch (error) {
        handleError(error, "Ocorreu um erro ao realizar a busca.", "useCompanyQuery");
        return [];
      }
    },
    enabled: !!searchParams,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
