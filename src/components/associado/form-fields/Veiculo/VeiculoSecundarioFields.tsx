
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

interface VeiculoSecundarioFieldsProps {
  register: any;
  watch: any;
  setValue: any;
}

export const VeiculoSecundarioFields: React.FC<VeiculoSecundarioFieldsProps> = ({ 
  register, 
  watch, 
  setValue 
}) => {
  const tipoVeiculoSecundario = watch('tipoVeiculoSecundario');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="placaSecundaria">Placa Secundária</Label>
        <Input
          id="placaSecundaria"
          type="text"
          placeholder="AAA0A00"
          {...register('placaSecundaria')}
        />
      </div>
      
      <div>
        <Label htmlFor="tipoVeiculoSecundario">Tipo de Veículo</Label>
        <Select
          value={tipoVeiculoSecundario}
          onValueChange={(value) => setValue('tipoVeiculoSecundario', value as 'Moto' | 'Carro')}
        >
          <SelectTrigger id="tipoVeiculoSecundario">
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
        <Label htmlFor="modeloVeiculoSecundario">Modelo do Veículo</Label>
        <Input
          id="modeloVeiculoSecundario"
          type="text"
          placeholder="Ex: Honda CB 500"
          {...register('modeloVeiculoSecundario')}
        />
      </div>
      
      <div>
        <Label htmlFor="corVeiculoSecundario">Cor do Veículo</Label>
        <Input
          id="corVeiculoSecundario"
          type="text"
          placeholder="Ex: Preto"
          {...register('corVeiculoSecundario')}
        />
      </div>
    </div>
  );
};
