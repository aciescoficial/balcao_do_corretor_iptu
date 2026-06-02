
import { supabase } from "@/integrations/supabase/client";

export async function checkUserIsAdmin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('has_role', {
      user_id: (await supabase.auth.getUser()).data.user?.id,
      role_to_check: 'admin'
    });
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

export async function validateAdminForDeletion(): Promise<boolean> {
  const isAdmin = await checkUserIsAdmin();
  if (!isAdmin) {
    throw new Error("Apenas administradores podem excluir cadastros");
  }
  return true;
}
