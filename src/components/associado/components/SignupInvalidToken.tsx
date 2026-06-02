
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignupInvalidTokenProps {
  error: string | null;
}

const SignupInvalidToken: React.FC<SignupInvalidTokenProps> = ({ error }) => {
  return (
    <div className="text-center max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Link inválido</h2>
      <p className="text-gray-600 mb-4">{error || "Este link é inválido ou expirou."}</p>
      <Button asChild>
        <a href="/">Voltar ao início</a>
      </Button>
    </div>
  );
};

export default SignupInvalidToken;
