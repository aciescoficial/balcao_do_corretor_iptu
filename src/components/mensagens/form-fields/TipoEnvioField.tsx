
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MensagemFormValues } from '../schema';

interface TipoEnvioFieldProps {
  control: Control<MensagemFormValues>;
}

const TipoEnvioField: React.FC<TipoEnvioFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="tipoEnvio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Envio</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de envio" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="notificacao">Notificação no sistema</SelectItem>
              <SelectItem value="push">Notificação Push</SelectItem>
              <SelectItem value="ambos">Todos os tipos</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Escolha como deseja enviar sua mensagem
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default TipoEnvioField;
