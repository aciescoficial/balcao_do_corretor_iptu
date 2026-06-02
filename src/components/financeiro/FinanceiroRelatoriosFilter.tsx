
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface FilterProps {
  onApplyFilters: (filters: any) => void;
}

export const FinanceiroRelatoriosFilter: React.FC<FilterProps> = ({
  onApplyFilters
}) => {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [tipoTransacao, setTipoTransacao] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('');
  const [valorMin, setValorMin] = React.useState<string>('');
  const [valorMax, setValorMax] = React.useState<string>('');

  const handleApplyFilters = () => {
    onApplyFilters({
      startDate,
      endDate,
      tipoTransacao,
      status,
      valorMin: valorMin ? parseFloat(valorMin) : undefined,
      valorMax: valorMax ? parseFloat(valorMax) : undefined,
    });
  };

  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setTipoTransacao('');
    setStatus('');
    setValorMin('');
    setValorMax('');
    onApplyFilters({});
  };

  return (
    <div className="border rounded-md p-4 bg-card">
      <h3 className="font-semibold mb-4">Filtros avançados</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Data Inicial */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Data Inicial</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Data Final */}
        <div className="space-y-2">
          <Label htmlFor="endDate">Data Final</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Tipo de Transação */}
        <div className="space-y-2">
          <Label htmlFor="tipoTransacao">Tipo de Transação</Label>
          <Select value={tipoTransacao} onValueChange={setTipoTransacao}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="mensalidade">Mensalidade</SelectItem>
              <SelectItem value="anuidade">Anuidade</SelectItem>
              <SelectItem value="taxa_adesao">Taxa de Adesão</SelectItem>
              <SelectItem value="carteirinha">Taxa de Carteirinha</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Valor Mínimo */}
        <div className="space-y-2">
          <Label htmlFor="valorMin">Valor Mínimo (R$)</Label>
          <Input 
            id="valorMin" 
            type="number" 
            step="0.01"
            placeholder="0,00"
            value={valorMin}
            onChange={(e) => setValorMin(e.target.value)}
          />
        </div>
        
        {/* Valor Máximo */}
        <div className="space-y-2">
          <Label htmlFor="valorMax">Valor Máximo (R$)</Label>
          <Input 
            id="valorMax" 
            type="number" 
            step="0.01"
            placeholder="0,00"
            value={valorMax}
            onChange={(e) => setValorMax(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={handleResetFilters}>Limpar Filtros</Button>
        <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
      </div>
    </div>
  );
};

