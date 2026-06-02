
import React, { useState, useEffect, ReactNode } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  fallback = null 
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Error caught by ErrorBoundary:", event.error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <Skeleton className="h-10 w-full" />
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
