
import { useState, useCallback } from 'react';
import { toast } from './use-toast';

export function useLoadingState(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const withLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string = "Ocorreu um erro na operação"
  ): Promise<T | undefined> => {
    setIsLoading(true);
    try {
      const result = await operation();
      return result;
    } catch (error) {
      console.error(errorMessage, error);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    withLoading,
    setIsLoading
  };
}
