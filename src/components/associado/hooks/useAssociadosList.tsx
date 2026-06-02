
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { useToast } from '@/hooks/use-toast';
import { AssociadoStatus } from '../types';

export interface AssociadoListItem {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  rg?: string;
  email: string;
  telefone: string;
  cidade: string;
  creci?: string;
  placa_principal?: string;
  placa_secundaria?: string;
  status: AssociadoStatus;
  created_at: string;
}

type SearchType = 'nome' | 'cpf' | 'creci' | 'placa';

export const useAssociadosList = () => {
  const [associados, setAssociados] = useState<AssociadoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('nome');
  const [statusFilter, setStatusFilter] = useState<AssociadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState<string>('todas');
  const [cidades, setCidades] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  const fetchCidades = async () => {
    try {
      const { data, error } = await extendedSupabase
        .from('associados')
        .select('cidade')
        .order('cidade');
      
      if (error) throw error;
      
      const cidadesData = data as Array<{ cidade: string }> || [];
      const uniqueCidades = Array.from(new Set(cidadesData.map(item => item.cidade)));
      setCidades(uniqueCidades);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchCidades();
    // Load data initially when the component mounts
    fetchAssociados();
  }, []);

  useEffect(() => {
    fetchAssociados();
  }, [currentPage, statusFilter, cidadeFilter, itemsPerPage]);

  const fetchAssociados = async () => {
    setLoading(true);
    try {
      let query = extendedSupabase
        .from('associados')
        .select('*', { count: 'exact' });

      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter as AssociadoStatus);
      }
      
      if (cidadeFilter !== 'todas') {
        query = query.eq('cidade', cidadeFilter);
      }

      if (searchTerm.trim()) {
        switch (searchType) {
          case 'nome':
            const termLower = searchTerm.toLowerCase();
            query = query.or(`nome.ilike.%${termLower}%,sobrenome.ilike.%${termLower}%`);
            break;
          case 'cpf':
            query = query.ilike('cpf', `%${searchTerm}%`);
            break;
          case 'creci':
            query = query.ilike('creci', `%${searchTerm}%`);
            break;
          case 'placa':
            query = query.or(`placa_principal.ilike.%${searchTerm}%,placa_secundaria.ilike.%${searchTerm}%`);
            break;
        }
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
      
      console.log('Lista query params:', { 
        searchTerm, 
        searchType, 
        statusFilter, 
        cidadeFilter, 
        currentPage, 
        itemsPerPage 
      });
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      console.log('Lista results:', data?.length || 0, 'items found');
      
      setAssociados((data || []) as AssociadoListItem[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching associados:', error);
      toast({
        title: 'Erro ao carregar associados',
        description: 'Não foi possível carregar a lista de associados.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchAssociados();
  };

  return {
    associados,
    loading,
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    statusFilter,
    setStatusFilter,
    cidadeFilter,
    setCidadeFilter,
    cidades,
    currentPage,
    setCurrentPage,
    totalCount,
    itemsPerPage,
    setItemsPerPage,
    handleSearch,
    fetchAssociados
  };
};
