
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAssociatedEntities = () => {
  const [associados, setAssociados] = useState<Array<{id: string, cpf: string, nome: string, sobrenome: string}>>([]);
  const [empresas, setEmpresas] = useState<Array<{id: string, cnpj: string, nome_fantasia: string}>>([]);
  const [loadingAssociados, setLoadingAssociados] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);

  const fetchAssociados = useCallback(async () => {
    setLoadingAssociados(true);
    try {
      const { data, error } = await supabase
        .from('associados')
        .select('id, cpf, nome, sobrenome')
        .eq('status', 'ativo');
        
      if (error) throw error;
      setAssociados(data || []);
    } catch (error) {
      console.error("Error fetching associados:", error);
    } finally {
      setLoadingAssociados(false);
    }
  }, []);

  const fetchEmpresas = useCallback(async () => {
    setLoadingEmpresas(true);
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, cnpj, nome_fantasia')
        .eq('status', 'ativo');
        
      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error("Error fetching empresas:", error);
    } finally {
      setLoadingEmpresas(false);
    }
  }, []);

  return {
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas
  };
};
