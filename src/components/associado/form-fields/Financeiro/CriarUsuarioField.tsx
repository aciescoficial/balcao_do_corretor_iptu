
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CriarUsuarioFieldProps {
  watch: any;
  setValue: any;
}

export const CriarUsuarioField: React.FC<CriarUsuarioFieldProps> = ({ watch, setValue }) => {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="criarUsuario"
          checked={watch('criarUsuario') || false}
          onCheckedChange={(checked) => setValue('criarUsuario', checked === true)}
        />
        <Label htmlFor="criarUsuario" className="font-medium">
          Criar usuário automaticamente
        </Label>
      </div>
      <p className="text-sm text-muted-foreground mt-1 ml-6">
        Se marcado, um usuário será criado e vinculado ao associado automaticamente. 
        Caso contrário, será enviado um email com link para criação de conta.
      </p>
    </div>
  );
};
