
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChartGroup } from './types';

interface ChartGroupFilterProps {
  chartGroupBy: ChartGroup;
  onChartGroupChange: (value: ChartGroup) => void;
}

export const ChartGroupFilter: React.FC<ChartGroupFilterProps> = ({
  chartGroupBy,
  onChartGroupChange
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Agrupar gráfico de faturamento</h3>
      <RadioGroup 
        value={chartGroupBy} 
        onValueChange={(value) => onChartGroupChange(value as ChartGroup)}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="month" id="chart-month" />
          <label htmlFor="chart-month">Por mês</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="day" id="chart-day" />
          <label htmlFor="chart-day">Por dia</label>
        </div>
      </RadioGroup>
    </div>
  );
};
