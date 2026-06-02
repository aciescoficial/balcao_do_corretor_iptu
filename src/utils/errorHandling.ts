
import { toast } from '@/hooks/use-toast';

type ErrorWithMessage = {
  message: string;
  [key: string]: any;
};

/**
 * Type guard to check if an error has a message property
 */
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  
  return "Ocorreu um erro inesperado";
}

/**
 * Handle errors consistently across the application
 * @param error The error to handle
 * @param fallbackMessage A fallback message to display if no message can be extracted
 * @param logPrefix Optional prefix for console logging
 */
export function handleError(error: unknown, fallbackMessage: string, logPrefix?: string): void {
  const prefix = logPrefix ? `${logPrefix}: ` : '';
  console.error(`${prefix}Error:`, error);
  
  const message = getErrorMessage(error) || fallbackMessage;
  
  toast({
    title: "Erro",
    description: message,
    variant: "destructive",
  });
}

/**
 * Higher-order function to wrap any async operation with error handling
 * @param operation The async operation to execute
 * @param errorMessage The error message to display if the operation fails
 * @returns A function that executes the operation with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string = "Ocorreu um erro na operação"
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    handleError(error, errorMessage);
    return undefined;
  }
}
