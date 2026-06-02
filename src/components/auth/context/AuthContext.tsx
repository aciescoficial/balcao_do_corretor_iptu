
import { createContext } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole, UserTag } from '../../usuarios/types';
import { SignUpOptions } from '../services/authService';

export interface AuthContextType {
  user: (SupabaseUser & { 
    role?: UserRole; 
    associado_id?: string; 
    empresa_id?: string;
    userTags?: UserTag[];
  }) | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string, options?: SignUpOptions) => Promise<{
    error: Error | null;
    data: any;
  }>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signInWithGoogle: () => Promise<{
    error: Error | null;
    data: any;
  }>;
  userRole: UserRole | null;
  userTags: UserTag[];
  isAdmin: boolean;
  hasFinanceiroAccess: boolean;
}

// Create the auth context with undefined as default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
