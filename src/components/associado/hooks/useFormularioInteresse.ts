
import { useState } from 'react';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { useToast } from '@/hooks/use-toast';
import { FormInteresseData } from '../schemas/formInteresseSchema';

export const useFormularioInteresse = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (data: FormInteresseData) => {
    setIsSubmitting(true);
    try {
      // Registrar na tabela de interesse
      const { error } = await extendedSupabase
        .from('associado_interesse')
        .insert({
          nome: data.nome,
          sobrenome: data.sobrenome,
          cpf: data.cpf,
          creci: data.creci, // Now this will always have a value since it's required
          email: data.email,
          celular: data.celular,
          cidade: data.cidade,
          estado: data.estado,
          motivo_interesse: data.motivoInteresse,
          status: 'pendente'
        });
        
      if (error) throw error;
      
      setSubmitted(true);
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Recebemos seu interesse. Em breve entraremos em contato.",
      });
      
    } catch (error: any) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: error.message || "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
  };

  return {
    isSubmitting,
    submitted,
    handleSubmit,
    resetForm
  };
};
