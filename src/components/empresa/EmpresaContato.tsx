import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmpresaFormData } from './types/formTypes';

interface EmpresaContatoProps {
  register: UseFormRegister<EmpresaFormData>;
  errors: FieldErrors<EmpresaFormData>;
}

const EmpresaContato: React.FC<EmpresaContatoProps> = ({ register, errors }) => {
  return (
    <>
      {/* Telefone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Telefone*</label>
        <input
          type="text"
          className={`wp-input w-full ${errors.telefone ? 'border-wp-error' : ''}`}
          placeholder="(00) 00000-0000"
          {...register('telefone', { required: "Telefone é obrigatório" })}
        />
        {errors.telefone && <p className="text-wp-error text-sm">{errors.telefone.message}</p>}
      </div>
      
      {/* Email */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">E-mail*</label>
        <input
          type="email"
          className={`wp-input w-full ${errors.email ? 'border-wp-error' : ''}`}
          {...register('email', { 
            required: "E-mail é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "E-mail inválido"
            } 
          })}
        />
        {errors.email && <p className="text-wp-error text-sm">{errors.email.message}</p>}
      </div>
      
      {/* Site */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Site</label>
        <input
          type="url"
          className="wp-input w-full"
          placeholder="https://www.example.com"
          {...register('site')}
        />
      </div>
      
      {/* Instagram */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Instagram</label>
        <input
          type="text"
          className="wp-input w-full"
          placeholder="@seuinstagram"
          {...register('instagram')}
        />
      </div>
      
      {/* WhatsApp */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">WhatsApp</label>
        <input
          type="text"
          className="wp-input w-full"
          placeholder="(00) 00000-0000"
          {...register('whatsapp')}
        />
      </div>
    </>
  );
};

export default EmpresaContato;
