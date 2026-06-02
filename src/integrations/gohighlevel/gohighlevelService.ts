
import { supabase } from "@/integrations/supabase/client";

interface ApiResponse {
  success: boolean;
  message?: string;
  count?: number;
  data?: any;
}

/**
 * Testa a conexão com o Go High Level
 */
export const testConnection = async (): Promise<ApiResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('gohighlevel-integration', {
      body: {
        action: 'test-connection',
      },
    });

    if (error) {
      console.error('Error testing Go High Level connection:', error);
      return { success: false, message: error.message };
    }

    return data || { success: true };
  } catch (error) {
    console.error('Error testing Go High Level connection:', error);
    return { success: false, message: 'Erro ao testar conexão' };
  }
};

/**
 * Sincroniza conveniados como contatos no Go High Level
 */
export const syncContacts = async (): Promise<ApiResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('gohighlevel-integration', {
      body: {
        action: 'sync-contacts',
      },
    });

    if (error) {
      console.error('Error syncing contacts to Go High Level:', error);
      return { success: false, message: error.message };
    }

    return data || { success: true, count: 0 };
  } catch (error) {
    console.error('Error syncing contacts to Go High Level:', error);
    return { success: false, message: 'Erro ao sincronizar contatos' };
  }
};

/**
 * Sincroniza empresas como empresas/contas no Go High Level
 */
export const syncCompanies = async (): Promise<ApiResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('gohighlevel-integration', {
      body: {
        action: 'sync-companies',
      },
    });

    if (error) {
      console.error('Error syncing companies to Go High Level:', error);
      return { success: false, message: error.message };
    }

    return data || { success: true, count: 0 };
  } catch (error) {
    console.error('Error syncing companies to Go High Level:', error);
    return { success: false, message: 'Erro ao sincronizar empresas' };
  }
};
