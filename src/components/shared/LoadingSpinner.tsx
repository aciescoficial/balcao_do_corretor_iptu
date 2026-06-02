
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  centered?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Carregando...', 
  centered = true,
  className = ''
}) => {
  // Define sizes in pixels
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };
  
  const spinnerSize = sizeMap[size];
  const containerClasses = centered 
    ? `flex flex-col items-center justify-center ${className}`
    : `flex flex-col items-start ${className}`;
  
  return (
    <div className={containerClasses}>
      <Loader2 className={`animate-spin text-primary h-${spinnerSize/4} w-${spinnerSize/4}`} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
