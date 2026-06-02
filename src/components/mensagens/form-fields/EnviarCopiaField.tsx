
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { MensagemFormValues } from '../schema';

interface EnviarCopiaFieldProps {
  control: Control<MensagemFormValues>;
}

const EnviarCopiaField: React.FC<EnviarCopiaFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="enviarCopia"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Enviar cópia para mim</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export default EnviarCopiaField;
