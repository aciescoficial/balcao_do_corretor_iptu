
import React from 'react';
import { UseFormReset } from 'react-hook-form';
import { EmpresaFormData } from '../../types/formTypes';

interface FormActionsProps {
  isSubmitting: boolean;
  onReset: UseFormReset<EmpresaFormData>;
}

export const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, onReset }) => {
  return (
    <div className="flex justify-end">
      <button 
        type="button" 
        className="wp-button-secondary mr-2"
        onClick={() => onReset()}
      >
        Cancelar
      </button>
      <button 
        type="submit" 
        className="wp-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
};
