
import { useCallback } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserCreation = (onSuccess: (user: User) => void) => {
  const { toast } = useToast();

  const addUser = useCallback(async (newUser: Partial<User>) => {
    console.log("Tentando adicionar usuário:", newUser);
    
    try {
      if (!newUser.email || !newUser.name) {
        toast({
          title: "Campos obrigatórios",
          description: "Email e nome são obrigatórios",
          variant: "destructive"
        });
        return false;
      }
      
      // Check if user already exists with this email
      const { data: existingUser, error: checkError } = await supabase
        .from('user')
        .select('id, email')
        .eq('email', newUser.email)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing user:", checkError);
        toast({
          title: "Erro ao verificar usuário existente",
          description: checkError.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (existingUser) {
        toast({
          title: "Usuário já existe",
          description: `Já existe um usuário cadastrado com o email ${newUser.email}`,
          variant: "destructive"
        });
        return false;
      }
      
      // Generate a random password
      const tempPassword = `temp${Math.random().toString(36).slice(2, 10)}`;
      
      console.log("Criando usuário com email:", newUser.email);
      
      // Step 1: Create the user in auth - no captcha required
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: tempPassword,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
            tags: newUser.tags,
            associado_id: newUser.associado_id,
            empresa_id: newUser.empresa_id
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast({
          title: "Erro ao criar usuário",
          description: authError.message,
          variant: "destructive"
        });
        return false;
      }

      console.log("Usuário Auth criado:", authData);

      // Step 2: Update the user table with additional data
      if (authData && authData.user) {
        const userData = {
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          tags: newUser.tags || [],
          active: true,
          associado_id: newUser.associado_id,
          empresa_id: newUser.empresa_id
        };
        
        console.log("Atualizando dados do usuário:", userData);
        
        const { error: userError } = await supabase
          .from('user') // Using 'user' table
          .upsert(userData);

        if (userError) {
          console.error("User update error:", userError);
          toast({
            title: "Erro ao atualizar dados do usuário",
            description: userError.message,
            variant: "destructive"
          });
          return false;
        }

        // Return the created user to the caller
        onSuccess({
          id: authData.user.id,
          name: newUser.name!,
          email: newUser.email!,
          role: newUser.role as UserRole,
          tags: newUser.tags || [],
          active: true,
          createdAt: new Date(),
          associado_id: newUser.associado_id,
          associado_cpf: newUser.associado_cpf,
          empresa_id: newUser.empresa_id,
          empresa_cnpj: newUser.empresa_cnpj
        });

        toast({
          title: "Usuário criado com sucesso",
          description: "Um email com instruções de acesso foi enviado para o usuário.",
        });

        return true;
      }
      
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível obter os dados do usuário criado.",
        variant: "destructive"
      });
      return false;
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      return false;
    }
  }, [onSuccess, toast]);

  return { addUser };
};
