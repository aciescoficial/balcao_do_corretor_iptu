
import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MensagemFormValues } from '../schema';

interface GrupoDestinatariosFieldProps {
  control: Control<MensagemFormValues>;
}

const GrupoDestinatariosField: React.FC<GrupoDestinatariosFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="grupoDestinatarios"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Grupo de Destinatários</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="associados">Associados</SelectItem>
              <SelectItem value="conveniados">Empresas Conveniadas</SelectItem>
              <SelectItem value="diretoria">Diretoria</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default GrupoDestinatariosField;
