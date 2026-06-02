
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MensagemFormValues } from '../schema';

interface AssuntoFieldProps {
  control: Control<MensagemFormValues>;
}

const AssuntoField: React.FC<AssuntoFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="assunto"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assunto</FormLabel>
          <FormControl>
            <Input placeholder="Digite o assunto da mensagem" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AssuntoField;
