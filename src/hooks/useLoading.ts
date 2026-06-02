
import { useState, useCallback } from 'react';
import { handleError } from '@/utils/errorHandling';

/**
 * Reusable hook for managing loading states and operations
 * @param initialState Initial loading state
 */
export function useLoading(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  /**
   * Execute an operation with loading state management
   * @param operation The async operation to execute
   * @param errorMessage The error message to display if the operation fails
   */
  const executeWithLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string = "Ocorreu um erro na operação"
  ): Promise<T | undefined> => {
    setIsLoading(true);
    try {
      const result = await operation();
      return result;
    } catch (error) {
      handleError(error, errorMessage);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    executeWithLoading
  };
}
