
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MensagemFormValues } from '../schema';

interface EmailDestinatarioFieldProps {
  control: Control<MensagemFormValues>;
}

const EmailDestinatarioField: React.FC<EmailDestinatarioFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="emailDestinatario"
      render={({ field }) => (
        <FormItem>
          <FormLabel>E-mail do Destinatário</FormLabel>
          <FormControl>
            <Input placeholder="email@exemplo.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailDestinatarioField;
