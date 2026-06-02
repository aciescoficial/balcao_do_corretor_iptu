
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <Button 
      type="submit" 
      disabled={isLoading} 
      className="mt-4"
    >
      {isLoading ? (
        <>Enviando...</>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
