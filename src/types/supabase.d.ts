
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole, UserTag } from '@/components/usuarios/types';

declare global {
  namespace SupabaseAuth {
    interface User extends SupabaseUser {
      role?: UserRole;
      associado_id?: string;
      empresa_id?: string;
      userTags?: UserTag[];
    }
  }
}

// Extend the User type from @supabase/supabase-js
declare module '@supabase/supabase-js' {
  interface User {
    role?: UserRole;
    associado_id?: string;
    empresa_id?: string;
    userTags?: UserTag[];
  }
}
