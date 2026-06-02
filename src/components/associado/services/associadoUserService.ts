import { supabase } from "@/integrations/supabase/client";
import { extendedSupabase } from "@/integrations/supabase/extendedClient";

interface CreateUserParams {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  cpf: string;
}

interface SendEmailParams {
  email: string;
  nome: string;
  sobrenome: string;
  associadoId: string;
}

/**
 * Create a new user account for the associado
 */
export const createUserForAssociado = async ({ id, email, nome, sobrenome, cpf }: CreateUserParams) => {
  try {
    // Check if user already exists with this email - using extended client
    const { data: existingUser, error: checkError } = await extendedSupabase
      .from('user')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingUser) {
      console.log("User already exists with this email:", email);
      return {
        success: false,
        error: { message: "Já existe um usuário com este email. Use outro email ou solicite redefinição de senha." }
      };
    }
    
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(2, 10);
    
    // Create user in auth - using extended client with service role key
    const { data: authData, error: authError } = await extendedSupabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: `${nome} ${sobrenome}`,
        associado_id: id,
        role: 'user'
      }
    });
    
    if (authError) throw authError;

    // Update user table with additional data - using extended client
    if (authData && authData.user) {
      const { error: userError } = await extendedSupabase
        .from('user')
        .insert({
          id: authData.user.id,
          name: `${nome} ${sobrenome}`,
          email: email,
          role: 'user',
          associado_id: id,
          active: true,
          cpf: cpf,
        });

      if (userError) throw userError;

      // Send email with login instructions
      await enviarEmailUsuarioCriado({
        email,
        nome,
        sobrenome,
        associadoId: id
      });
      
      return { success: true };
    }
    
    throw new Error("Não foi possível criar o usuário");
  } catch (error) {
    console.error("Erro ao criar usuário para associado:", error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Send an email to a newly created user
 */
const enviarEmailUsuarioCriado = async ({ email, nome, sobrenome, associadoId }: SendEmailParams) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        template_id: 'usuario_criado',
        template_data: {
          nome: `${nome} ${sobrenome}`,
          link_login: `${window.location.origin}/auth/login`,
          password: 'Enviada separadamente por segurança' // The actual password is not included in the email for security reasons
        }
      }
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar e-mail para usuário criado:", error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Send registration email with link to register
 */
export const sendRegistrationEmail = async ({ email, nome, sobrenome, associadoId }: SendEmailParams) => {
  try {
    // Check if user already exists with this email
    const { data: existingUser, error: checkError } = await supabase
      .from('user')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingUser) {
      console.log("User already exists with this email:", email);
      return {
        success: false,
        error: { message: "Já existe um usuário com este email. Use outro email ou solicite redefinição de senha." }
      };
    }
    
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        template_id: 'convite_cadastro',
        template_data: {
          nome: `${nome} ${sobrenome}`,
          link_cadastro: `${window.location.origin}/cadastro?associado=${associadoId}`
        }
      }
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar e-mail de cadastro:", error);
    return {
      success: false,
      error
    };
  }
};
