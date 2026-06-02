
import { useState } from 'react';
import { toast } from 'sonner';
import { FinanceiroFilters } from './types';

export const useFinanceiroFilters = (
  onApplyFilters: (filters: FinanceiroFilters) => void
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FinanceiroFilters>({
    period: 'month',
    dateFilterType: 'dueDate',
    chartGroupBy: 'day',
  });

  const handleFilterChange = (key: keyof FinanceiroFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateChange = (key: 'startDate' | 'endDate', value: Date | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    toast.success('Filtros aplicados com sucesso');
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const defaultFilters: FinanceiroFilters = {
      period: 'month',
      dateFilterType: 'dueDate',
      chartGroupBy: 'day',
      startDate: null,
      endDate: null,
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    toast.success('Filtros limpos com sucesso');
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== null && value !== undefined && value !== ''
  ).length;

  return {
    isOpen,
    setIsOpen,
    filters,
    activeFiltersCount,
    handleFilterChange,
    handleDateChange,
    handleApplyFilters,
    handleClearFilters,
  };
};
