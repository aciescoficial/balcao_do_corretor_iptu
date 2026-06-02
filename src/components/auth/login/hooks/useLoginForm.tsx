
import { useState } from 'react';
import { useAuth } from '../../AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from 'react-router-dom';

export const useLoginForm = (onForgotPassword: () => void) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // Redirect back to the page that triggered the login (e.g. /consulta-iptu)
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Tentando login com email:', email);
      
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos",
        });
        setIsLoading(false);
        return;
      }
      
      const { success, error } = await signIn(email, password);
      
      if (!success) {
        let errorMessage = error || "Erro de autenticação";
        
        toast({
          variant: "destructive",
          title: "Erro ao entrar",
          description: errorMessage,
        });
      } else {
        toast({
          title: "Login realizado",
          description: "Você foi autenticado com sucesso.",
        });
        
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Exception during login:', error);
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: error.message || "Ocorreu um erro durante o login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password, 
    setPassword,
    isLoading,
    showPassword,
    setShowPassword,
    handleSignIn,
    onForgotPassword
  };
};
