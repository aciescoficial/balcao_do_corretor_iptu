
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { MensagemFormValues } from '../schema';

interface MensagemFieldProps {
  control: Control<MensagemFormValues>;
}

const MensagemField: React.FC<MensagemFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="mensagem"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mensagem</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Digite sua mensagem aqui..." 
              className="min-h-[150px]" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MensagemField;
