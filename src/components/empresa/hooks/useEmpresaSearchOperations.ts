
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmpresaData, EmpresaResponse } from './types/empresaSearchTypes';
import { 
  searchNearbyCompanies as searchNearbyCompaniesService,
  searchByTerm as searchByTermService,
  searchByCityAndNiche as searchByCityAndNicheService
} from './services/empresaSearchService';

export const useEmpresaSearchOperations = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmpresaData[]>([]);
  const { toast } = useToast();

  const searchNearbyCompanies = async (latitude: number, longitude: number, radius: number = 10) => {
    setIsSearching(true);
    
    try {
      const nearbyCompanies = await searchNearbyCompaniesService(latitude, longitude);
      setResults(nearbyCompanies);
      
      if (nearbyCompanies.length === 0) {
        toast({
          title: "Nenhuma empresa encontrada",
          description: "Não foram encontradas empresas próximas à sua localização.",
        });
      }
      
      return nearbyCompanies;
    } catch (error: any) {
      console.error("Error searching nearby companies:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const searchByTerm = async (
    searchType: 'nome' | 'cnpj' | 'nicho' | 'cidade', 
    searchTerm: string
  ) => {
    setIsSearching(true);
    
    try {
      const companies = await searchByTermService(searchType, searchTerm);
      
      if (companies.length > 0) {
        setResults(companies);
        return companies;
      } else {
        setResults([]);
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas com os critérios informados.",
        });
        return [];
      }
    } catch (error: any) {
      console.error("Error searching data:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const searchByCityAndNiche = async (cidadeFilter: string, nichoFilter: string) => {
    setIsSearching(true);
    
    try {
      const companies = await searchByCityAndNicheService(cidadeFilter, nichoFilter);
      
      if (companies.length > 0) {
        setResults(companies);
        return companies;
      } else {
        setResults([]);
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontradas empresas com os critérios informados.",
        });
        return [];
      }
    } catch (error: any) {
      console.error("Error searching data:", error);
      toast({
        title: "Erro na busca",
        description: error.message || "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    results,
    setResults,
    searchNearbyCompanies,
    searchByTerm,
    searchByCityAndNiche
  };
};
