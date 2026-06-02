
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { mensagemSchema, type MensagemFormValues } from '../schema';
import TipoEnvioField from '../form-fields/TipoEnvioField';
import DestinatarioField from '../form-fields/DestinatarioField';
import EmailDestinatarioField from '../form-fields/EmailDestinatarioField';
import GrupoDestinatariosField from '../form-fields/GrupoDestinatariosField';
import AssuntoField from '../form-fields/AssuntoField';
import MensagemField from '../form-fields/MensagemField';
import EnviarCopiaField from '../form-fields/EnviarCopiaField';
import SubmitButton from './SubmitButton';
import { useFormSubmission } from '../hooks/useFormSubmission';

const MensagensForm: React.FC = () => {
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
  
  // Usar nosso hook personalizado para gerenciar o envio
  const { onSubmit, isLoading } = useFormSubmission(form.reset);

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
        <SubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
};

export default React.memo(MensagensForm);
