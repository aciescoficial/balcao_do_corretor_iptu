
import React, { useState } from 'react';
import { type ChartData, type FinancialSummary } from './types';
import FinanceiroResumoFilter, { FinanceiroFilters } from './FinanceiroResumoFilter';
import ConveniadosCard from './components/ConveniadosCard';
import CobrancasCard from './components/CobrancasCard';
import FaturamentoCard from './components/FaturamentoCard';
import FaturamentoChart from './components/FaturamentoChart';

const FinanceiroResumoPage: React.FC = () => {
  // Initial data with zeros to represent a clean state
  const [summaryData] = useState<FinancialSummary>({
    clients: { total: 0, defaulters: 0 },
    bills: { expected: 0, overdue: 0, received: 0 },
    revenue: { expected: 0, confirmed: 0, received: 0 }
  });

  // Clean chart data - empty state
  const [chartData] = useState<ChartData[]>([
    { date: '01/Abr', expected: 0, received: 0 },
    { date: '05/Abr', expected: 0, received: 0 },
    { date: '10/Abr', expected: 0, received: 0 },
    { date: '15/Abr', expected: 0, received: 0 },
    { date: '20/Abr', expected: 0, received: 0 },
    { date: '25/Abr', expected: 0, received: 0 },
    { date: '30/Abr', expected: 0, received: 0 },
  ]);

  const [filters, setFilters] = useState<FinanceiroFilters>({
    period: 'month',
    dateFilterType: 'dueDate',
    chartGroupBy: 'day',
  });

  const handleApplyFilters = (newFilters: FinanceiroFilters) => {
    setFilters(newFilters);
    // Aqui seria feita uma chamada à API para buscar dados filtrados
    console.log('Filtros aplicados:', newFilters);
  };

  // Function to open links in new windows/tabs
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Resumo Financeiro</h1>
      </div>

      <FinanceiroResumoFilter onApplyFilters={handleApplyFilters} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conveniados Card */}
        <ConveniadosCard 
          clients={summaryData.clients} 
          openInNewTab={openInNewTab} 
        />

        {/* Cobranças Card */}
        <CobrancasCard 
          bills={summaryData.bills} 
          openInNewTab={openInNewTab} 
        />

        {/* Faturamento Card */}
        <FaturamentoCard 
          revenue={summaryData.revenue} 
        />
      </div>

      {/* Chart Section */}
      <FaturamentoChart chartData={chartData} />
    </div>
  );
};

export default FinanceiroResumoPage;
