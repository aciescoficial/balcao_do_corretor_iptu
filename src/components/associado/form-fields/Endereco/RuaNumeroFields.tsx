
import React from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RuaNumeroFieldsProps {
  register: any;
}

export const RuaNumeroFields: React.FC<RuaNumeroFieldsProps> = ({ register }) => {
  return (
    <>
      <div>
        <Label htmlFor="rua" className="flex items-center gap-2">
          <MapPin size={16} />
          Rua
        </Label>
        <Input
          id="rua"
          type="text"
          {...register('rua')}
        />
      </div>
      
      <div className="md:col-span-1">
        <Label htmlFor="numero">Número</Label>
        <Input
          id="numero"
          type="text"
          {...register('numero')}
        />
      </div>
    </>
  );
};
