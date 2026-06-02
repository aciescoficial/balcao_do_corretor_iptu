
import { useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for handling timeouts with improved error handling
 * @param ms Time in milliseconds before timeout
 * @param fallbackValue Value to return on timeout
 */
export const useTimeout = <T>(ms: number, fallbackValue: T) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const operationRef = useRef<string | null>(null);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        
        if (operationRef.current) {
          console.log(`Cleaned up timeout for operation: ${operationRef.current}`);
          operationRef.current = null;
        }
      }
    };
  }, []);

  const withTimeout = useCallback(
    async (promise: Promise<T>, operationName: string = 'unknown'): Promise<T> => {
      operationRef.current = operationName;
      console.log(`Starting operation '${operationName}' with ${ms}ms timeout`);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create a promise that resolves with the fallback value after ms milliseconds
      const timeoutPromise = new Promise<T>((resolve) => {
        timeoutRef.current = setTimeout(() => {
          console.warn(`Operation '${operationName}' timed out after ${ms}ms, using default values`);
          resolve(fallbackValue);
        }, ms);
      });

      try {
        // Race the actual promise against the timeout
        const result = await Promise.race([
          promise.catch(error => {
            console.error(`Error in operation '${operationName}':`, error);
            throw error;
          }),
          timeoutPromise
        ]);
        
        // Clear the timeout if the promise resolved
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        console.log(`Operation '${operationName}' completed successfully`);
        operationRef.current = null;
        return result;
      } catch (error) {
        // Clear the timeout if the promise rejected
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        console.error(`Operation '${operationName}' failed with error:`, error);
        operationRef.current = null;
        return fallbackValue;
      }
    },
    [ms, fallbackValue]
  );

  return { withTimeout };
};
