
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserTag } from '../usuarios/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  userTags: UserTag[];
  loading: boolean;
  isAdmin: boolean;
  hasFinanceiroAccess: boolean;
  
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, options?: {
    role?: UserRole;
    retryCount?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userTags, setUserTags] = useState<UserTag[]>([]);
  const { toast } = useToast();

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('role, tags, active, associado_id, empresa_id')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user data:", error);
        setUserRole('user');
        setUserTags([]);
        return;
      }
      
      if (data) {
        console.log("User data fetched:", data);
        setUserRole(data.role as UserRole);
        
        if (Array.isArray(data.tags)) {
          const validUserTags = data.tags
            .filter(tag => 
              ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
               'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc']
              .includes(tag)
            ) as UserTag[];
          
          setUserTags(validUserTags);
          
          setUser(prevUser => {
            if (!prevUser) return null;
            
            const extendedUser = {
              ...prevUser,
              role: data.role as UserRole,
              associado_id: data.associado_id,
              empresa_id: data.empresa_id,
              userTags: validUserTags
            };
            
            return extendedUser;
          });
        }

        try {
          const { error: logError } = await supabase
            .from('user_access_logs')
            .insert({ 
              user_id: userId,
              event: 'login',
            });
            
          if (logError) console.error("Error logging activity:", logError);
        } catch (logErr) {
          console.error("Error in activity logging:", logErr);
        }
      } else {
        setUserRole('user');
        setUserTags([]);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      setUserRole('user');
      setUserTags([]);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('SignIn attempt with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      });
      
      if (error) {
        console.error('SignIn error:', error);
        return { success: false, error: error.message };
      }
      
      if (data?.user?.id) {
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('active')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (userError) {
          console.error('Error fetching user status:', userError);
        } else if (userData && userData.active === false) {
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: 'Conta desativada. Por favor, contate o administrador.' 
          };
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Exception during sign in:', error);
      return { 
        success: false, 
        error: error.message || 'Ocorreu um erro durante o login' 
      };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    options?: { role?: UserRole; retryCount?: number }
  ) => {
    try {
      const role = options?.role || 'user';
      const retryCount = options?.retryCount || 0;
      
      // Verificar se o papel de usuário é permitido com base no cliente
      let userRole = role;
      
      // Verificar associação de papel - Diretoria -> admin
      if (userRole === 'admin') {
        userRole = 'diretoria';
      }
      
      const signUpOptions: any = {
        email,
        password,
        options: {
          data: { name, role: userRole },
          emailRedirectTo: `${window.location.origin}/login`
        }
      };
      
      const { data, error } = await supabase.auth.signUp(signUpOptions);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          return { 
            success: false, 
            error: 'Este email já está registrado. Tente fazer login.' 
          };
        }
        
        if (error.status === 429 || error.message.includes('rate limit') || 
            error.message.includes('limite') || error.message.includes('exceeded')) {
          return {
            success: false,
            error: {
              message: 'Limite de envio de emails excedido. Por favor, tente novamente mais tarde.',
              code: 'rate_limit',
              status: 429,
              retryAfter: 60,
              retryCount: retryCount
            }
          };
        }
        
        return { success: false, error: error.message };
      }
      
      if (data?.user) {
        try {
          // Definir tags com base no papel
          let userTags: UserTag[] = [];
          if (userRole === 'diretoria') {
            userTags = ['diretoria_aciesc'];
          }
          
          const { error: profileError } = await supabase
            .from('user')
            .insert({
              id: data.user.id,
              email,
              name,
              role: userRole,
              active: true,
              tags: userTags
            });
          
          if (profileError) {
            console.error('Error creating user profile:', profileError);
            return { success: false, error: profileError.message };
          }
        } catch (profileError: any) {
          console.error('Exception creating user profile:', profileError);
          return { success: false, error: profileError.message };
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error during sign up:', error);
      return { 
        success: false, 
        error: error.message || 'Ocorreu um erro durante o cadastro' 
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      
      if (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error during password reset:', error);
      return { 
        success: false, 
        error: error.message || 'Ocorreu um erro durante a recuperação de senha' 
      };
    }
  };

  const refreshSession = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        await fetchUserData(data.session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  useEffect(() => {
    console.log("AuthProvider mounted");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserData(newSession.user!.id);
          }, 0);
        } else {
          setUserRole(null);
          setUserTags([]);
        }
      }
    );
    
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          await fetchUserData(data.session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      console.log("Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = userRole === 'admin' || userRole === 'diretoria' as UserRole;
  
  const hasFinanceiroAccess = isAdmin || 
    userTags.some(tag => tag === 'financeiro') || 
    userRole === 'diretoria' as UserRole;
  
  const value = {
    user,
    userRole,
    userTags,
    loading,
    isAdmin,
    hasFinanceiroAccess,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshSession,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
