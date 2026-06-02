
import React from 'react';
import FormularioInteresseForm from './components/FormularioInteresseForm';
import FormularioInteresseSuccess from './components/FormularioInteresseSuccess';
import { useFormularioInteresse } from './hooks/useFormularioInteresse';

const FormularioInteresse: React.FC = () => {
  const { isSubmitting, submitted, handleSubmit, resetForm } = useFormularioInteresse();
  
  return (
    <div className="p-6 bg-white rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Formulário de Interesse - ACIESC</h2>
      
      {submitted ? (
        <FormularioInteresseSuccess onSubmitAnother={resetForm} />
      ) : (
        <FormularioInteresseForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      )}
    </div>
  );
};

export default FormularioInteresse;
