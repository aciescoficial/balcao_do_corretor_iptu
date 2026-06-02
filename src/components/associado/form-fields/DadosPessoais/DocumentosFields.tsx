
import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DocumentosFieldsProps {
  register: any;
}

export const DocumentosFields: React.FC<DocumentosFieldsProps> = ({ register }) => {
  return (
    <>
      <div>
        <Label htmlFor="creci">Número CRECI-SC</Label>
        <Input
          id="creci"
          type="text"
          {...register('creci')}
        />
      </div>
      
      <div>
        <Label htmlFor="dataNascimento" className="flex items-center gap-2">
          <Calendar size={16} />
          Data de Nascimento
        </Label>
        <Input
          id="dataNascimento"
          type="date"
          {...register('dataNascimento')}
        />
      </div>

      <div>
        <Label htmlFor="validade" className="flex items-center gap-2">
          <Calendar size={16} />
          Validade
        </Label>
        <Input
          id="validade"
          type="date"
          {...register('validade')}
        />
      </div>
    </>
  );
};
