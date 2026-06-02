
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';
import { EnderecoFormValues } from './schema';

interface DadosPessoaisProps {
  control: Control<EnderecoFormValues>;
}

export const DadosPessoais: React.FC<DadosPessoaisProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="sobrenome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sobrenome</FormLabel>
            <FormControl>
              <Input placeholder="Sobrenome" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
