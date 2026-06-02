
export type FilterPeriod = 'start' | 'year' | 'month' | 'custom';
export type DateFilterType = 'dueDate' | 'paymentDate';
export type ChartGroup = 'month' | 'day';

export interface FinanceiroFilters {
  period: FilterPeriod;
  dateFilterType: DateFilterType;
  startDate?: Date | null;
  endDate?: Date | null;
  chartGroupBy: ChartGroup;
}
