
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { mensagemSchema, type MensagemFormValues } from './schema';
import TipoEnvioField from './form-fields/TipoEnvioField';
import DestinatarioField from './form-fields/DestinatarioField';
import EmailDestinatarioField from './form-fields/EmailDestinatarioField';
import GrupoDestinatariosField from './form-fields/GrupoDestinatariosField';
import AssuntoField from './form-fields/AssuntoField';
import MensagemField from './form-fields/MensagemField';
import EnviarCopiaField from './form-fields/EnviarCopiaField';
import { useMensagensSubmit } from './hooks/useMensagensSubmit';

const MensagensForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { submitMensagem } = useMensagensSubmit();

  // Configuração do formulário com React Hook Form e validação Zod
  const form = useForm<MensagemFormValues>({
    resolver: zodResolver(mensagemSchema),
    defaultValues: {
      assunto: '',
      mensagem: '',
      tipoEnvio: 'email',
      destinatario: 'usuario',
      enviarCopia: false,
    },
  });

  // Tipo de destinatário selecionado (usuário individual ou grupo)
  const tipoDestinatario = form.watch('destinatario');
  
  // Função para enviar o formulário
  const onSubmit = useCallback(async (values: MensagemFormValues) => {
    setIsLoading(true);
    
    try {
      await submitMensagem(values);
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [form, submitMensagem]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TipoEnvioField control={form.control} />
        <DestinatarioField control={form.control} />
        
        {tipoDestinatario === 'usuario' && (
          <EmailDestinatarioField control={form.control} />
        )}
        
        {tipoDestinatario === 'grupo' && (
          <GrupoDestinatariosField control={form.control} />
        )}
        
        <AssuntoField control={form.control} />
        <MensagemField control={form.control} />
        <EnviarCopiaField control={form.control} />
        
        {/* Botão de envio */}
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="mt-4"
        >
          {isLoading ? (
            <>Enviando...</>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default React.memo(MensagensForm);
