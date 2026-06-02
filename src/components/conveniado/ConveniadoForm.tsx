
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { ConveniadoFormData } from './types';
import { DadosPessoaisForm } from './DadosPessoaisForm';
import { ContatoForm } from './ContatoForm';
import { EnderecoForm } from './EnderecoForm';
import { VeiculoForm } from './VeiculoForm';
import { FinanceiroForm } from './FinanceiroForm';
import { saveConveniado, uploadFoto } from './conveniadoService';
import { useFotoUpload } from './hooks/useFotoUpload';

export const ConveniadoForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<ConveniadoFormData>();
  const { handleSubmit, reset, setValue, watch } = form;
  
  const { fotoPreview, removeFoto, handleFotoUpload } = useFotoUpload(watch, setValue);
  
  const onSubmit = async (data: ConveniadoFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save conveniado data
      const conveniadoResult = await saveConveniado(data);
      
      // Upload photo if provided
      if (data.foto && data.foto[0]) {
        await uploadFoto(conveniadoResult.id, data.foto[0]);
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "O conveniado foi cadastrado e está aguardando aprovação.",
      });
      
      reset();
    } catch (error: any) {
      console.error("Error inserting data:", error);
      
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao cadastrar o conveniado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    removeFoto();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <DadosPessoaisForm 
        form={form}
        fotoPreview={fotoPreview}
        onFotoUpload={handleFotoUpload}
        onFotoRemove={removeFoto}
      />
      
      <ContatoForm form={form} />
      
      <EnderecoForm form={form} />
      
      <VeiculoForm form={form} />
      
      <FinanceiroForm form={form} />
      
      <div className="wp-notice-warning">
        <p className="font-medium">Atenção</p>
        <p className="text-sm">Após o cadastro, o conveniado ficará com status pendente de aprovação até que a documentação seja verificada.</p>
      </div>
      
      <div className="flex justify-end">
        <button 
          type="button" 
          className="wp-button-secondary mr-2"
          onClick={handleCancel}
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
    </form>
  );
};
