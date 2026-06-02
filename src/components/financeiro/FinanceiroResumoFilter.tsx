
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { PeriodFilter } from './filters/PeriodFilter';
import { DateTypeFilter } from './filters/DateTypeFilter';
import { ChartGroupFilter } from './filters/ChartGroupFilter';
import { FilterActions } from './filters/FilterActions';
import { useFinanceiroFilters } from './filters/useFinanceiroFilters';
import type { FinanceiroFilters } from './filters/types';

export { type FilterPeriod, type DateFilterType, type ChartGroup, type FinanceiroFilters } from './filters/types';

interface FinanceiroResumoFilterProps {
  onApplyFilters: (filters: FinanceiroFilters) => void;
}

const FinanceiroResumoFilter: React.FC<FinanceiroResumoFilterProps> = ({ onApplyFilters }) => {
  const {
    isOpen,
    setIsOpen,
    filters,
    activeFiltersCount,
    handleFilterChange,
    handleDateChange,
    handleApplyFilters,
    handleClearFilters,
  } = useFinanceiroFilters(onApplyFilters);

  return (
    <div>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={16} />
        <span>Filtros ({activeFiltersCount})</span>
      </Button>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="border rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PeriodFilter
              period={filters.period}
              startDate={filters.startDate}
              endDate={filters.endDate}
              onPeriodChange={(value) => handleFilterChange('period', value)}
              onDateChange={handleDateChange}
            />

            <DateTypeFilter
              dateFilterType={filters.dateFilterType}
              onDateFilterTypeChange={(value) => handleFilterChange('dateFilterType', value)}
            />

            <ChartGroupFilter
              chartGroupBy={filters.chartGroupBy}
              onChartGroupChange={(value) => handleFilterChange('chartGroupBy', value)}
            />
          </div>

          <FilterActions
            activeFiltersCount={activeFiltersCount}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FinanceiroResumoFilter;
