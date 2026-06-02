
import React from 'react';
import { Loader2 } from 'lucide-react';

interface AppLoadingProps {
  message?: string;
}

const AppLoading: React.FC<AppLoadingProps> = ({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-12 w-12 animate-spin text-aciesc-primary mb-4" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default AppLoading;
