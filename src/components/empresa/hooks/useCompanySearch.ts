
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaData } from '../types';
import { CompanySearchFormValues } from '../components/search/schema';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandling';

export const useCompanySearch = () => {
  const [results, setResults] = useState<EmpresaData[]>([]);
  const { isLoading, executeWithLoading } = useLoading(false);
  const { toast } = useToast();

  const searchCompanies = async (params: CompanySearchFormValues) => {
    console.log('Searching with params:', params);
    
    return executeWithLoading(async () => {
      try {
        let query = supabase
          .from('empresas')
          .select('*');

        // Apply status filter
        if (params.status !== 'todos') {
          query = query.eq('status', params.status);
        }

        // Apply search filters
        if (params.searchTerm && params.searchTerm.trim() !== '') {
          if (params.searchType === 'nome') {
            query = query.or(`nome_fantasia.ilike.%${params.searchTerm}%,razao_social.ilike.%${params.searchTerm}%`);
          } else if (params.searchType === 'cnpj') {
            query = query.ilike('cnpj', `%${params.searchTerm}%`);
          } else if (params.searchType === 'nicho') {
            query = query.ilike('nicho', `%${params.searchTerm}%`);
          }
        }

        const { data, error } = await query;
        console.log('Search results:', data);

        if (error) throw error;

        setResults(data || []);

        if ((data || []).length === 0) {
          toast({
            title: "Nenhum resultado encontrado",
            description: "Tente outros termos de busca.",
          });
        }
        
        return data || [];
      } catch (error) {
        handleError(error, "Ocorreu um erro ao realizar a busca.", "searchCompanies");
        return [];
      }
    }, "Erro ao realizar a busca de empresas");
  };

  return {
    isLoading,
    results,
    searchCompanies
  };
};
