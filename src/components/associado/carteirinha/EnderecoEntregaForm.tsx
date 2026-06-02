
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { enderecoSchema, EnderecoFormValues } from './endereco-form/schema';
import { DadosPessoais } from './endereco-form/DadosPessoais';
import { EnderecoPrincipal } from './endereco-form/EnderecoPrincipal';
import { EnderecoComplemento } from './endereco-form/EnderecoComplemento';
import { LocalidadeFields } from './endereco-form/LocalidadeFields';
import { ConfirmationCheckbox } from './endereco-form/ConfirmationCheckbox';
import { SubmitButton } from './endereco-form/SubmitButton';

interface EnderecoEntregaFormProps {
  defaultValues: Partial<EnderecoFormValues>;
  onSubmit: (data: EnderecoFormValues) => void;
  isLoading: boolean;
}

export const EnderecoEntregaForm: React.FC<EnderecoEntregaFormProps> = ({ 
  defaultValues,
  onSubmit,
  isLoading
}) => {
  const form = useForm<EnderecoFormValues>({
    resolver: zodResolver(enderecoSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DadosPessoais control={form.control} />
        <EnderecoPrincipal control={form.control} />
        <EnderecoComplemento control={form.control} />
        <LocalidadeFields control={form.control} />
        <ConfirmationCheckbox control={form.control} />
        <SubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
};
