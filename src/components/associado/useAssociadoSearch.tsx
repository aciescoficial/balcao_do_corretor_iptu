import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { Associado, AssociadoStatus } from './types';

export const useAssociadoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci' | 'placa'>('nome');
  const [statusFilter, setStatusFilter] = useState<AssociadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState<string>('todas');
  const [cidades, setCidades] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Associado[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchCidades = async () => {
    try {
      const { data, error } = await extendedSupabase
        .from('associados')
        .select('cidade')
        .order('cidade');
      
      if (error) throw error;
      
      const associadosData = data as { cidade: string }[];
      const uniqueCidades = Array.from(new Set(associadosData.map(item => item.cidade) || []));
      setCidades(uniqueCidades);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchAssociados = async (isSearchAction: boolean = false) => {
    if (isSearchAction) {
      setCurrentPage(1);
    }

    setIsSearching(true);
    
    try {
      let query = extendedSupabase.from('associados').select('*', { count: 'exact' });
      
      if (searchTerm.trim()) {
        if (searchType === 'nome') {
          const termLower = searchTerm.toLowerCase();
          query = query.or(`nome.ilike.%${termLower}%,sobrenome.ilike.%${termLower}%`);
        } else if (searchType === 'cpf') {
          query = query.ilike('cpf', `%${searchTerm}%`);
        } else if (searchType === 'creci') {
          query = query.ilike('creci', `%${searchTerm}%`);
        } else if (searchType === 'placa') {
          query = query.or(`placa_principal.ilike.%${searchTerm}%,placa_secundaria.ilike.%${searchTerm}%`);
        }
      }
      
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter as AssociadoStatus);
      }
      
      if (cidadeFilter !== 'todas') {
        query = query.eq('cidade', cidadeFilter);
      }
      
      if (itemsPerPage !== -1) {
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        query = query
          .order('created_at', { ascending: false })
          .range(from, to);
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      console.log('Search query params:', { 
        searchTerm, 
        searchType, 
        statusFilter, 
        cidadeFilter, 
        currentPage, 
        itemsPerPage 
      });
      
      const { data, error, count } = await query;
      
      if (error) throw error;

      console.log('Search results:', data?.length || 0, 'items found');

      if (!data || data.length === 0) {
        setResults([]);
        if (searchTerm.trim()) {
          toast({
            title: "Nenhum resultado encontrado",
            description: "Não foram encontrados associados com os critérios informados.",
          });
        }
        return;
      }
      
      setTotalCount(count || 0);
      
      const associadoIds = data.map(item => item.id);
      const { data: profilesData, error: profilesError } = await extendedSupabase
        .from('user')
        .select('id, avatar_url')
        .in('id', associadoIds);
        
      if (profilesError) throw profilesError;
      
      const associadosWithAvatars = data.map(associado => {
        const profile = profilesData?.find(p => p.id === associado.id);
        return {
          ...associado,
          avatar_url: profile?.avatar_url || null
        } as Associado;
      });
      
      setResults(associadosWithAvatars);
      
    } catch (error) {
      console.error('Error searching associados:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchAssociados(true);
  };

  useEffect(() => {
    fetchAssociados();
  }, [currentPage, itemsPerPage]);

  return {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    statusFilter,
    setStatusFilter,
    cidadeFilter,
    setCidadeFilter,
    cidades,
    isSearching,
    results,
    handleSearch,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalCount,
    fetchAssociados
  };
};
