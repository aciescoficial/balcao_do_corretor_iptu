
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from 'react-hook-form';
import { EnderecoFormValues } from './schema';

interface ConfirmationCheckboxProps {
  control: Control<EnderecoFormValues>;
}

export const ConfirmationCheckbox: React.FC<ConfirmationCheckboxProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="confirmarEndereco"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Confirmo que este endereço está correto e a carteirinha deve ser enviada para este local
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
