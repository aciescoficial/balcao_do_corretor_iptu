
import React from 'react';

const FormularioInteresseEmbed: React.FC = () => {
  return (
    <div className="wp-notice-info mb-6">
      <div className="bg-white p-4 rounded-md">
        <iframe
          src="/formulario-interesse"
          width="100%"
          height="650"
          frameBorder="0"
          title="Formulário de Interesse"
          className="border rounded"
        ></iframe>
      </div>
      <p className="text-sm mt-2 text-center text-gray-500">
        Visualização do formulário que será incorporado no site.
      </p>
    </div>
  );
};

export default FormularioInteresseEmbed;
