
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarRange } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FilterPeriod } from './types';

interface PeriodFilterProps {
  period: FilterPeriod;
  startDate?: Date | null;
  endDate?: Date | null;
  onPeriodChange: (value: FilterPeriod) => void;
  onDateChange: (key: 'startDate' | 'endDate', date: Date | null) => void;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  period,
  startDate,
  endDate,
  onPeriodChange,
  onDateChange
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Selecione o período de exibição</h3>
      <RadioGroup 
        value={period} 
        onValueChange={(value) => onPeriodChange(value as FilterPeriod)}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="start" id="period-start" />
          <label htmlFor="period-start">Desde o início</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="year" id="period-year" />
          <label htmlFor="period-year">Este ano</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="month" id="period-month" />
          <label htmlFor="period-month">Este mês</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="period-custom" />
          <label htmlFor="period-custom">Personalizado</label>
        </div>
      </RadioGroup>

      {period === 'custom' && (
        <div className="mt-4 space-y-4">
          {/* Start Date */}
          <div>
            <h4 className="text-sm font-medium mb-2">Data de início</h4>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarRange className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate || undefined}
                  onSelect={(date) => onDateChange('startDate', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* End Date */}
          <div>
            <h4 className="text-sm font-medium mb-2">Data de término</h4>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarRange className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={(date) => onDateChange('endDate', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};
