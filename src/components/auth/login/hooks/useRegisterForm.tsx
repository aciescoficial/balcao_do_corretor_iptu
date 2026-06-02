
import { useState } from 'react';
import { useAuth } from '../../AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { UserRole } from '@/components/usuarios/types';
import { useNavigate } from 'react-router-dom';
import { usePasswordManagement } from './usePasswordManagement';
import { useRetryLogic } from './useRetryLogic';
import { handleSignUpError } from '../services/errorHandlingService';

// Define a generic error type to help with type checking
interface ErrorWithMessage {
  message: string;
  [key: string]: any;
}

// Type guard to check if an error has a message property
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

// Extract error message from various error types
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return "Ocorreu um erro durante o cadastro";
}

export const useRegisterForm = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [organizationType, setOrganizationType] = useState<UserRole>('user');
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordsMatch
  } = usePasswordManagement(password, confirmPassword);

  const {
    isRateLimited,
    setIsRateLimited,
    retryCount,
    setRetryCount,
    retryCountdown,
    setRetryCountdown
  } = useRetryLogic();

  const validateFields = () => {
    if (!name || !email || !password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFields()) return;
    
    setIsLoading(true);
    
    try {
      console.log("Tentando registrar com email:", email, "e tipo:", organizationType);
      
      const { success, error } = await signUp(email, password, name, {
        role: organizationType,
        retryCount
      });
      
      if (!success && error) {
        console.error("Signup error:", error);
        
        const errorResult = handleSignUpError(error);
        
        if (errorResult?.isRateLimit) {
          setIsRateLimited(true);
          setRetryCount(prev => prev + 1);
          setRetryCountdown(errorResult.retryTime);
          
          toast({
            variant: "destructive",
            title: "Limite de tentativas excedido",
            description: `${errorResult.message}. Tentativa: ${retryCount + 1}. Tente novamente em ${errorResult.retryTime} segundos.`,
          });
        } else {
          // Handle the error object safely with our helper function
          const errorMessage = getErrorMessage(error);
          
          toast({
            variant: "destructive",
            title: "Erro ao criar conta",
            description: errorMessage,
          });
        }
      } else {
        setIsRateLimited(false);
        setRetryCount(0);
        
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada. Verifique seu email para confirmar o cadastro.",
        });
        
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setOrganizationType('user');
        
        navigate('/login?registered=true');
      }
    } catch (error: unknown) {
      console.error("Exception during signup:", error);
      
      // Handle the caught exception safely with our helper function
      const errorMessage = getErrorMessage(error);
      
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: errorMessage,
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
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordsMatch,
    organizationType,
    setOrganizationType,
    isRateLimited,
    retryCount,
    retryCountdown,
    handleSignUp
  };
};
