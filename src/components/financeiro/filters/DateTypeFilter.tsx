
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateFilterType } from './types';

interface DateTypeFilterProps {
  dateFilterType: DateFilterType;
  onDateFilterTypeChange: (value: DateFilterType) => void;
}

export const DateTypeFilter: React.FC<DateTypeFilterProps> = ({
  dateFilterType,
  onDateFilterTypeChange
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Filtrar por data</h3>
      <Select 
        value={dateFilterType} 
        onValueChange={(value) => onDateFilterTypeChange(value as DateFilterType)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecionar tipo de data" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Data de vencimento</SelectItem>
          <SelectItem value="paymentDate">Data de pagamento</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
