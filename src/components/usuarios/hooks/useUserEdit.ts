
import { useState, useCallback } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserEdit = (onSuccess: (user: User) => void) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [associados, setAssociados] = useState<Array<{id: string, cpf: string, nome: string, sobrenome: string}>>([]);
  const [empresas, setEmpresas] = useState<Array<{id: string, cnpj: string, nome_fantasia: string}>>([]);
  const [loadingAssociados, setLoadingAssociados] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const { toast } = useToast();
  
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

  const handleSelectedUserChange = useCallback((field: string, value: any) => {
    setSelectedUser(prev => prev ? ({ ...prev, [field]: value }) : null);
  }, []);

  const updateUser = useCallback(async () => {
    if (!selectedUser) return false;
    
    try {
      console.log("Updating user:", selectedUser);
      
      // Update user table (NOT profiles) - Corrected table reference
      const { error: userError } = await supabase
        .from('user')
        .update({
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role,
          tags: selectedUser.tags || [],
          associado_id: selectedUser.associado_id,
          empresa_id: selectedUser.empresa_id,
          active: selectedUser.active
        })
        .eq('id', selectedUser.id);

      if (userError) {
        console.error("Error updating user:", userError);
        toast({
          title: "Erro ao atualizar usuário",
          description: userError.message,
          variant: "destructive"
        });
        return false;
      }
      
      // Return the updated user to the caller
      onSuccess(selectedUser);
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso."
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return false;
    }
  }, [selectedUser, onSuccess, toast]);

  const toggleUserActive = useCallback(async (userId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('user')
        .update({ active })
        .eq('id', userId);

      if (error) {
        console.error("Error toggling user active state:", error);
        toast({
          title: "Erro ao alterar status",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error toggling user active state:", error);
      toast({
        title: "Erro ao alterar status",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  return {
    selectedUser,
    setSelectedUser,
    handleSelectedUserChange,
    updateUser,
    toggleUserActive,
    associados,
    empresas,
    loadingAssociados,
    loadingEmpresas,
    fetchAssociados,
    fetchEmpresas
  };
};
