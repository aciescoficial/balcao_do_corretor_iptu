
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MensagemFormValues } from '../schema';

interface DestinatarioFieldProps {
  control: Control<MensagemFormValues>;
}

const DestinatarioField: React.FC<DestinatarioFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="destinatario"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Destinatário</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de destinatário" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="usuario">Usuário específico</SelectItem>
              <SelectItem value="grupo">Grupo de usuários</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default DestinatarioField;
