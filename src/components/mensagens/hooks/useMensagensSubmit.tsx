
import { useCallback } from 'react';
import { toast } from 'sonner';
import { MensagemFormValues } from '../schema';
import { useMessages } from './useMessages';

export const useMensagensSubmit = () => {
  const { addMessage } = useMessages();
  
  // Função para enviar a mensagem
  const submitMensagem = useCallback(async (values: MensagemFormValues): Promise<void> => {
    // Log para depuração
    console.log('Enviando mensagem:', values);
    
    // Simulando um envio com atraso
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determinar a prioridade baseada no assunto
    let priority: 'normal' | 'high' | 'urgent' = 'normal';
    const lowercaseAssunto = values.assunto.toLowerCase();
    
    if (lowercaseAssunto.includes('urgente') || lowercaseAssunto.includes('importante')) {
      priority = 'high';
    } else if (lowercaseAssunto.includes('emergência') || lowercaseAssunto.includes('crítico')) {
      priority = 'urgent';
    }
    
    // Add the message to our local state
    addMessage({
      title: values.assunto,
      content: values.mensagem,
      sender: values.tipoEnvio === 'email' 
        ? (values.destinatario === 'usuario' ? values.emailDestinatario || 'Usuário' : 'Grupo de Usuários')
        : 'Sistema',
      priority
    });
    
    // Se chegou aqui, o envio foi bem sucedido
    toast.success('Mensagem enviada com sucesso!');
    
    // Aqui iria o código para enviar a mensagem através de uma API
    // Em produção, poderia ser um fetch, axios, etc para um endpoint real
    
    return Promise.resolve();
  }, [addMessage]);

  return { submitMensagem };
};

export default useMensagensSubmit;
