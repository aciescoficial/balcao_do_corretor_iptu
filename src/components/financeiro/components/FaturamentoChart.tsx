
import React from 'react';
import { DollarSign } from 'lucide-react';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { formatCurrency } from '../utils';
import { type ChartData } from '../types';

interface FaturamentoChartProps {
  chartData: ChartData[];
}

const FaturamentoChart: React.FC<FaturamentoChartProps> = ({ chartData }) => {
  return (
    <div className="wp-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
          Faturamento
        </h2>
      </div>

      <div className="h-72">
        <ChartContainer
          config={{
            expected: {
              label: "Previsto",
              theme: {
                light: "#2c3e50",
                dark: "#2c3e50"
              }
            },
            received: {
              label: "Recebido",
              theme: {
                light: "#f39c12",
                dark: "#f39c12"
              }
            }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 25, bottom: 35, left: 25 }}
            >
              <defs>
                <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2c3e50" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2c3e50" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f39c12" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f39c12" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickMargin={10}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickMargin={10}
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent
                        className="text-xs"
                        labelClassName="text-xs font-normal"
                        nameKey="name"
                        labelKey="date"
                        formatter={(value, name) => {
                          return [
                            `R$ ${formatCurrency(value as number).replace("R$", "")}`,
                            name === "expected" ? "Previsto" : "Recebido"
                          ];
                        }}
                      />
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="expected"
                name="expected"
                stackId="1"
                stroke="#2c3e50"
                fill="url(#colorExpected)"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="received"
                name="received"
                stackId="2"
                stroke="#f39c12"
                fill="url(#colorReceived)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default FaturamentoChart;
