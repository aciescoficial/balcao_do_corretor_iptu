import { useState, useEffect } from 'react';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { useToast } from '@/hooks/use-toast';

export type ConveniadoStatus = 'ativo' | 'pendente' | 'inativo';

export interface Conveniado {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  creci?: string;
  cidade: string;
  status: ConveniadoStatus;
  placa_principal?: string;
  placa_secundaria?: string;
  created_at: string;
}

export const useConveniadoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nome' | 'cpf' | 'creci' | 'placa'>('nome');
  const [statusFilter, setStatusFilter] = useState<ConveniadoStatus | 'todos'>('todos');
  const [cidadeFilter, setCidadeFilter] = useState('todas');
  const [cidades, setCidades] = useState<string[]>([]);
  const [conveniados, setConveniados] = useState<Conveniado[]>([]);
  const [loading, setLoading] = useState(false);
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
      setCidades(uniqueCidades.filter(Boolean).sort());
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchConveniados = async () => {
    setLoading(true);
    
    try {
      let query = extendedSupabase.from('associados').select('*', { count: 'exact' });
      
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
      
      if (statusFilter !== 'todos') {
        query = query.eq('status', statusFilter);
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
      
      console.log('Conveniado search params:', { 
        searchTerm,
        searchType, 
        statusFilter, 
        cidadeFilter,
        currentPage,
        itemsPerPage
      });
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      console.log('Conveniado search results:', data?.length || 0, 'items found');
      
      setConveniados((data || []).map(item => ({
        id: item.id,
        nome: item.nome,
        sobrenome: item.sobrenome,
        cpf: item.cpf,
        email: item.email,
        telefone: item.telefone,
        creci: item.creci,
        cidade: item.cidade,
        status: item.status as ConveniadoStatus,
        placa_principal: item.placa_principal,
        placa_secundaria: item.placa_secundaria,
        created_at: item.created_at
      })));
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching conveniados:', error);
      toast({
        title: 'Erro ao carregar associados',
        description: 'Não foi possível carregar a lista de associados.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchConveniados();
  };

  useEffect(() => {
    fetchConveniados();
  }, [currentPage, itemsPerPage, statusFilter, cidadeFilter]);

  return {
    conveniados,
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
    fetchConveniados
  };
};
