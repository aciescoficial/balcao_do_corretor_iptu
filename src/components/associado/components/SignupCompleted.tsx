
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SignupCompleted: React.FC = () => {
  return (
    <div className="text-center max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Cadastro Concluído!</h2>
      <p className="text-gray-600 mb-6">
        Seu cadastro foi finalizado com sucesso. Agora você já pode fazer login na plataforma.
      </p>
      <Button asChild>
        <a href="/login">Fazer Login</a>
      </Button>
    </div>
  );
};

export default SignupCompleted;
