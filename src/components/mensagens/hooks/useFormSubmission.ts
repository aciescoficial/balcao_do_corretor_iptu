
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MensagemFormValues } from '../schema';
import { useMensagensSubmit } from './useMensagensSubmit';
import { UseFormReset } from 'react-hook-form';

export const useFormSubmission = (reset: UseFormReset<MensagemFormValues>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { submitMensagem } = useMensagensSubmit();

  const onSubmit = useCallback(async (values: MensagemFormValues) => {
    setIsLoading(true);
    
    try {
      await submitMensagem(values);
      reset();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [reset, submitMensagem]);

  return { onSubmit, isLoading };
};
