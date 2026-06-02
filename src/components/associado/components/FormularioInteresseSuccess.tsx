
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormularioInteresseSuccessProps {
  onSubmitAnother: () => void;
}

const FormularioInteresseSuccess: React.FC<FormularioInteresseSuccessProps> = ({
  onSubmitAnother
}) => {
  return (
    <div className="text-center p-6 bg-white rounded shadow-sm">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Formulário Enviado com Sucesso!</h2>
      <p className="mb-4">Agradecemos seu interesse em se associar à ACIESC.</p>
      <p className="mb-6">Suas informações foram recebidas e nossa equipe irá analisá-las. Entraremos em contato em breve através do e-mail fornecido.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onSubmitAnother}>Enviar outro formulário</Button>
        <Button variant="outline" asChild>
          <a href="https://www.aciesc.com.br">Sair Agora</a>
        </Button>
      </div>
    </div>
  );
};

export default FormularioInteresseSuccess;
