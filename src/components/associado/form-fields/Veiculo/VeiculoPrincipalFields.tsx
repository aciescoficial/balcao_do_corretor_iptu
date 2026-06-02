
import React from 'react';
import { Car, Bike } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { tiposVeiculos } from '../../types';

interface VeiculoPrincipalFieldsProps {
  register: any;
  watch: any;
  setValue: any;
}

export const VeiculoPrincipalFields: React.FC<VeiculoPrincipalFieldsProps> = ({ 
  register, 
  watch, 
  setValue 
}) => {
  const tipoVeiculoPrincipal = watch('tipoVeiculoPrincipal');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="placaPrincipal" className="flex items-center gap-2">
          <Car size={16} />
          Placa Principal
        </Label>
        <Input
          id="placaPrincipal"
          type="text"
          placeholder="AAA0A00"
          {...register('placaPrincipal')}
        />
      </div>
      
      <div>
        <Label htmlFor="tipoVeiculoPrincipal">Tipo de Veículo</Label>
        <Select
          value={tipoVeiculoPrincipal}
          onValueChange={(value) => setValue('tipoVeiculoPrincipal', value as 'Moto' | 'Carro')}
        >
          <SelectTrigger id="tipoVeiculoPrincipal">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {tiposVeiculos.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo === 'Moto' ? (
                  <span className="flex items-center gap-2">
                    <Bike size={14} /> {tipo}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Car size={14} /> {tipo}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="modeloVeiculoPrincipal">Modelo do Veículo</Label>
        <Input
          id="modeloVeiculoPrincipal"
          type="text"
          placeholder="Ex: Honda Civic"
          {...register('modeloVeiculoPrincipal')}
        />
      </div>
      
      <div>
        <Label htmlFor="corVeiculoPrincipal">Cor do Veículo</Label>
        <Input
          id="corVeiculoPrincipal"
          type="text"
          placeholder="Ex: Prata"
          {...register('corVeiculoPrincipal')}
        />
      </div>
    </div>
  );
};
