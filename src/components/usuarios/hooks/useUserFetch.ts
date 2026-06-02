
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, checkDatabaseConnectivity } from '@/integrations/supabase/client';
import { User, UserRole, UserTag } from '../types';
import { mapFromDbRole } from '../utils/roleUtils';
import { useToast } from '@/components/ui/use-toast';

export const useUserFetch = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const normalizedSearch = searchTerm.toLowerCase();
    return users.filter(
      user => 
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        (user.associado_cpf && user.associado_cpf.toLowerCase().includes(normalizedSearch)) ||
        (user.empresa_cnpj && user.empresa_cnpj.toLowerCase().includes(normalizedSearch))
    );
  }, [users, searchTerm]);

  // Check database connectivity first
  const checkConnection = useCallback(async () => {
    try {
      const isConnected = await checkDatabaseConnectivity();
      setConnectionStatus(isConnected);
      
      if (!isConnected) {
        setError(new Error('Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.'));
        setLoading(false);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet.",
          variant: "destructive"
        });
      }
      
      return isConnected;
    } catch (err) {
      setConnectionStatus(false);
      setError(err instanceof Error ? err : new Error('Erro ao verificar a conexão'));
      setLoading(false);
      return false;
    }
  }, [toast]);

  // Fetch all users from the database with improved timeout handling
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check connectivity first
    const isConnected = await checkConnection();
    if (!isConnected) return;

    // Set a timeout to ensure we don't hang indefinitely - reduced to 3 seconds for faster feedback
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError(new Error('A busca de usuários demorou muito tempo. Por favor, tente novamente.'));
      toast({
        title: "Erro de timeout",
        description: "A busca de usuários excedeu o tempo limite. Por favor, tente novamente.",
        variant: "destructive"
      });
    }, 3000); // 3 seconds timeout (reduced from 5 seconds)

    try {
      console.log('Fetching users from database...');
      
      // Fetch users with role information and join with associados and empresas
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select(`
          *,
          associado:associado_id(cpf),
          empresa:empresa_id(cnpj)
        `)
        .limit(100); // Limit to improve performance

      // Clear the timeout since we got a response
      clearTimeout(timeoutId);

      if (userError) {
        console.error('Error fetching users:', userError);
        throw userError;
      }
      
      console.log('Users fetched:', userData?.length || 0);

      if (!userData) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Try to fetch auth users to get emails (separate query to avoid timeouts)
      let authUsers: { id: string; email: string }[] = [];
      try {
        const { data: authUsersData, error: authError } = await supabase.rpc('get_auth_users');
        if (!authError && authUsersData) {
          authUsers = authUsersData;
          console.log('Auth users fetched via RPC:', authUsers.length);
        } else {
          console.warn('Could not fetch auth users via RPC:', authError);
        }
      } catch (err) {
        console.warn('Error in RPC call for auth users (continuing with users only):', err);
      }

      // Map users to User objects and fill in email from auth users if available
      const mappedUsers: User[] = userData.map(user => {
        // Try to find matching auth user email
        let email = user.email || '';
        const matchingAuthUser = authUsers.find(au => au.id === user.id);
        if (matchingAuthUser && matchingAuthUser.email) {
          email = matchingAuthUser.email;
        }

        // Convert string[] to UserTag[] by filtering to only valid UserTag values
        const validUserTags = Array.isArray(user.tags) ? user.tags.filter(tag => 
          ['corretor', 'corretor_autonomo', 'empresa_conveniada', 'diretoria_aciesc', 
           'administrador', 'financeiro', 'proprietario_imobiliaria', 'imobiliaria', 'aciesc'].includes(tag)
        ) as UserTag[] : [];
        
        return {
          id: user.id,
          name: user.name || '',
          email: email,  
          role: mapFromDbRole(user.role),
          tags: validUserTags,
          active: user.active !== false, // Default to true if not specified
          createdAt: new Date(user.created_at),
          associado_id: user.associado_id || undefined,
          associado_cpf: user.associado?.cpf || undefined,
          empresa_id: user.empresa_id || undefined,
          empresa_cnpj: user.empresa?.cnpj || undefined
        };
      });

      console.log('Mapped users:', mappedUsers.length);
      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      
      // Show a more specific error message to the user
      toast({
        title: "Erro ao carregar usuários",
        description: err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao carregar usuários.",
        variant: "destructive"
      });
    } finally {
      // Clear the timeout just in case (if it hasn't fired yet)
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [toast, checkConnection]);

  // Fetch users on component mount
  useEffect(() => {
    console.log('useUserFetch hook mounted, fetching users...');
    fetchUsers();
    
    // Create an interval to refresh connection status
    const intervalId = setInterval(() => {
      checkConnection();
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchUsers, checkConnection]);

  return {
    users,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filteredUsers,
    fetchUsers,
    connectionStatus
  };
};
