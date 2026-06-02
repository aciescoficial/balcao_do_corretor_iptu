
import React from 'react';
import MensagensForm from './form/MensagensForm';
import MensagensHeader from './components/MensagensHeader';

const MensagensPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <MensagensHeader />
      
      <div className="wp-card">
        <h2 className="text-xl font-semibold mb-4">Enviar Nova Mensagem</h2>
        <MensagensForm />
      </div>
    </div>
  );
};

export default MensagensPage;
