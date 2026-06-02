import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { ConveniadoData } from '../types';

export const useConveniadoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedConveniado, setSelectedConveniado] = useState<ConveniadoData | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, insira um nome ou CPF para buscar o associado.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const term = searchTerm.toLowerCase();
      const { data, error } = await extendedSupabase
        .from('associados')
        .select('*')
        .or(`nome.ilike.%${term}%,sobrenome.ilike.%${term}%,cpf.ilike.%${term}%`);
      
      console.log('Carteirinha search term:', term, 'Results:', data?.length || 0);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Não foram encontrados associados com os critérios informados.",
        });
        setSelectedConveniado(null);
      } else if (data.length === 1) {
        // Map the database record to ConveniadoData type
        const associado = data[0];
        setSelectedConveniado({
          id: associado.id,
          nome: associado.nome || '',
          sobrenome: associado.sobrenome || '',
          cpf: associado.cpf || '',
          email: associado.email || '',
          telefone: associado.telefone || '',
          status: associado.status || 'pendente',
          creci: associado.creci || '',
          validade: associado.validade ? new Date(associado.validade).toLocaleDateString() : 'N/A',
          foto_url: undefined // Will be updated if there is a profile image
        });
        
        // If there is an ID, fetch the associate's photo from the related profile
        if (associado.id) {
          fetchAssociadoFoto(associado.id);
        }
      } else {
        // If more than one result, select the first one
        const associado = data[0];
        setSelectedConveniado({
          id: associado.id,
          nome: associado.nome || '',
          sobrenome: associado.sobrenome || '',
          cpf: associado.cpf || '',
          email: associado.email || '',
          telefone: associado.telefone || '',
          status: associado.status || 'pendente',
          creci: associado.creci || '',
          validade: associado.validade ? new Date(associado.validade).toLocaleDateString() : 'N/A',
          foto_url: undefined // Will be updated if there is a profile image
        });
        
        // If there is an ID, fetch the associate's photo from the related profile
        if (associado.id) {
          fetchAssociadoFoto(associado.id);
        }
        
        toast({
          title: "Múltiplos resultados",
          description: `Encontramos ${data.length} associados. Exibindo o primeiro resultado.`,
        });
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao realizar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Function to fetch the associate's photo from their profile
  const fetchAssociadoFoto = async (associadoId: string) => {
    try {
      const { data: profileData, error } = await extendedSupabase
        .from('user')
        .select('avatar_url')
        .eq('id', associadoId)
        .single();
      
      if (error) {
        console.error("Error fetching profile image:", error);
        return;
      }
      
      if (profileData && profileData.avatar_url) {
        setSelectedConveniado(prev => {
          if (!prev) return null;
          return {
            ...prev,
            foto_url: profileData.avatar_url
          };
        });
      }
    } catch (err) {
      console.error("Error in fetchAssociadoFoto:", err);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    selectedConveniado,
    handleSearch
  };
};
