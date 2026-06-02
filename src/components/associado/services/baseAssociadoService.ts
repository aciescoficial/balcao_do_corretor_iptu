
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { logOperation } from '@/components/audit/auditLogService';

/**
 * Base service functions for associado operations
 */

export const getAssociadoById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('associados')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error(`Erro ao buscar associado com ID ${id}:`, errorMsg);
    throw error;
  }
};
