
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bcjibnbhjjgthlbeewnf.supabase.co";
// ⚠️  ATENÇÃO: Atualize esta chave com a service_role key do novo projeto.
// Dashboard Supabase → Settings → API → "service_role (secret)"
// Projeto: aciesc-gestao-v2 (bcjibnbhjjgthlbeewnf)
// ⚠️  SEGURANÇA: idealmente esta chave deve ficar apenas em Edge Functions,
//     não exposta no bundle do frontend.
const SUPABASE_SERVICE_KEY = "SUBSTITUA_PELA_SERVICE_ROLE_KEY_DO_NOVO_PROJETO";

// Create an extended client with admin privileges for special operations
export const extendedSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Securely delete a record from a table using the extended client with admin privileges.
 * This bypasses RLS policies and should only be used by admin users.
 * 
 * @param table - The table name to delete from
 * @param id - The ID of the record to delete
 * @returns Promise with the delete operation result
 */
export const secureDelete = async (table: string, id: string): Promise<{ success: boolean, error: any | null }> => {
  try {
    const { error } = await extendedSupabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Exception deleting from ${table}:`, error);
    return { success: false, error };
  }
};

