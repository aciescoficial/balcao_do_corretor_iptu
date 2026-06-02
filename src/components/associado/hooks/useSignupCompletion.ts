
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { z } from 'zod';

export const signupPasswordSchema = z.object({
  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(100, "A senha não pode ter mais de 100 caracteres"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export type SignupPasswordData = z.infer<typeof signupPasswordSchema>;

export interface SignupData {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
}

export interface UseSignupCompletionReturn {
  loading: boolean;
  submitting: boolean;
  tokenValid: boolean;
  signupData: SignupData | null;
  completed: boolean;
  error: string | null;
  handleSubmit: (data: SignupPasswordData) => Promise<void>;
}

export const useSignupCompletion = (token: string | null): UseSignupCompletionReturn => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        if (!token) {
          setError("Token de verificação não encontrado");
          setTokenValid(false);
          return;
        }
        
        // Validate token
        const { data, error } = await extendedSupabase
          .from("signup_tokens")
          .select(`
            token,
            expires_at,
            associado_interesse_id,
            used,
            associado_interesse:associado_interesse_id (
              id,
              nome,
              sobrenome,
              email,
              cpf
            )
          `)
          .eq("token", token)
          .single();
          
        if (error || !data) {
          setError("Token inválido ou expirado");
          setTokenValid(false);
          return;
        }
        
        // Check if token expired
        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        
        if (now > expiresAt) {
          setError("Este link expirou. Por favor, solicite um novo.");
          setTokenValid(false);
          return;
        }
        
        // Check if already used
        if (data.used) {
          setError("Este link já foi utilizado");
          setTokenValid(false);
          return;
        }
        
        // Token is valid
        setTokenValid(true);
        
        // Extract associado_interesse data and ensure it's typed correctly
        if (!data.associado_interesse) {
          throw new Error("Dados do associado não encontrados");
        }
        
        // The issue is that data.associado_interesse might be an array
        // We need to handle both cases - if it's an array, take the first item
        const interesseData = Array.isArray(data.associado_interesse) 
          ? data.associado_interesse[0] 
          : data.associado_interesse;
        
        if (!interesseData) {
          throw new Error("Dados do associado inválidos");
        }
        
        // Ensure we're setting a single object that matches SignupData interface
        setSignupData({
          id: interesseData.id,
          nome: interesseData.nome,
          sobrenome: interesseData.sobrenome,
          email: interesseData.email,
          cpf: interesseData.cpf
        });
        
      } catch (error) {
        console.error("Erro ao validar token:", error);
        setError("Ocorreu um erro ao validar o token");
        setTokenValid(false);
      } finally {
        setLoading(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  const handleSubmit = async (data: SignupPasswordData) => {
    if (!signupData) return;
    
    setSubmitting(true);
    try {
      // Create auth account
      const { error: signupError } = await extendedSupabase.auth.signUp({
        email: signupData.email,
        password: data.password,
        options: {
          data: {
            name: `${signupData.nome} ${signupData.sobrenome}`
          }
        }
      });
      
      if (signupError) throw signupError;
      
      // Create associado record
      const { error: associadoError } = await extendedSupabase
        .from("associados")
        .insert({
          nome: signupData.nome,
          sobrenome: signupData.sobrenome,
          email: signupData.email,
          cpf: signupData.cpf,
          cidade: 'Pendente atualização',
          telefone: 'Pendente atualização',
          status: 'ativo'
        });
        
      if (associadoError) throw associadoError;
      
      // Mark token as used
      await extendedSupabase
        .from("signup_tokens")
        .update({ used: true })
        .eq("token", token);
        
      setCompleted(true);
      
    } catch (error: any) {
      console.error("Erro ao finalizar cadastro:", error);
      toast({
        title: "Erro ao finalizar cadastro",
        description: error.message || "Ocorreu um erro ao finalizar seu cadastro",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    tokenValid,
    signupData,
    completed,
    error,
    handleSubmit
  };
};
