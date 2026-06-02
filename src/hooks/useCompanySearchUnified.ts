
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmpresaData } from '@/components/empresa/types';
import { CompanySearchFormValues } from '@/components/empresa/components/search/schema';
import { handleError } from '@/utils/errorHandling';

/**
 * A unified hook for company search functionality
 */
export const useCompanySearchUnified = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const { toast } = useToast();

  /**
   * Search companies with the provided parameters
   * @param params Search parameters
   */
  const searchCompanies = async (params: CompanySearchFormValues) => {
    console.log('Searching with params:', params);
    setIsLoading(true);
    
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
    } catch (error) {
      handleError(error, "Ocorreu um erro ao realizar a busca.", "searchCompanies");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset search results
   */
  const resetResults = () => {
    setResults([]);
  };

  return {
    isLoading,
    results,
    searchCompanies,
    resetResults
  };
};
