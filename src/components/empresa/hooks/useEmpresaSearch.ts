
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmpresaData } from '../types';
import { useLocationServices } from './useLocationServices';
import { useEmpresaSearchOperations } from './useEmpresaSearchOperations';
import { useCityData } from './useCityData';

export const useEmpresaSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cnpj' | 'nicho' | 'cidade' | 'cidade_nicho' | 'mapa'>('mapa');
  const [cidadeFilter, setCidadeFilter] = useState('');
  const [nichoFilter, setNichoFilter] = useState<string>('');
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaData | null>(null);
  const { toast } = useToast();

  const { cidades } = useCityData();
  
  const { 
    currentLocation,
    setCurrentLocation,
    getCurrentLocation,
    locateEmpresa: locateEmpresaBase
  } = useLocationServices();

  const {
    isSearching,
    results,
    setResults,
    searchNearbyCompanies,
    searchByTerm,
    searchByCityAndNiche
  } = useEmpresaSearchOperations();
  
  useEffect(() => {
    if (searchType === 'mapa' && !currentLocation) {
      getCurrentLocation();
    }
  }, [searchType, currentLocation, getCurrentLocation]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchType === 'mapa') {
      if (!currentLocation) {
        getCurrentLocation();
      } else {
        searchNearbyCompanies(currentLocation.lat, currentLocation.lng);
      }
      return;
    }
    
    if (searchType === 'cidade_nicho') {
      if (!cidadeFilter && !nichoFilter) {
        toast({
          title: "Filtros vazios",
          description: "Por favor, selecione pelo menos uma cidade ou nicho para realizar a busca.",
          variant: "destructive",
        });
        return;
      }
      
      await searchByCityAndNiche(cidadeFilter, nichoFilter);
      return;
    }
    
    if (!searchTerm.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, insira um termo para realizar a busca.",
        variant: "destructive",
      });
      return;
    }
    
    await searchByTerm(searchType, searchTerm);
  };

  const locateEmpresa = useCallback((empresa: EmpresaData) => {
    const located = locateEmpresaBase(empresa);
    if (located) {
      setSelectedEmpresa(located);
    }
  }, [locateEmpresaBase]);

  return {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    cidadeFilter,
    setCidadeFilter,
    nichoFilter,
    setNichoFilter,
    cidades,
    isSearching,
    results,
    currentLocation,
    setCurrentLocation,
    selectedEmpresa,
    setSelectedEmpresa,
    handleSearch,
    getCurrentLocation,
    searchNearbyCompanies,
    locateEmpresa
  };
};
