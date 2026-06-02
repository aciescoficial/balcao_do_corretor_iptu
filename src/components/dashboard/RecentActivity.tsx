
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentActivityProps {
  recentActivity: {
    type: 'associado' | 'empresa';
    name: string;
    action: string;
    date: string;
  }[];
  loading: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ recentActivity, loading }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-left">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="text-left font-medium py-2 px-3">Tipo</th>
                <th className="text-left font-medium py-2 px-3">Nome</th>
                <th className="text-left font-medium py-2 px-3">Ação</th>
                <th className="text-left font-medium py-2 px-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, index) => (
                  <tr key={`loading-${index}`} className="border-b">
                    <td className="py-3 px-3"><Skeleton className="h-6 w-20" /></td>
                    <td className="py-3 px-3"><Skeleton className="h-6 w-32" /></td>
                    <td className="py-3 px-3"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3 px-3"><Skeleton className="h-6 w-24" /></td>
                  </tr>
                ))
              ) : recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">Nenhuma atividade recente encontrada</td>
                </tr>
              ) : (
                recentActivity.map((activity, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3">
                      {activity.type === 'associado' ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">Associado</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">Empresa</span>
                      )}
                    </td>
                    <td className="py-3 px-3">{activity.name}</td>
                    <td className="py-3 px-3">{activity.action}</td>
                    <td className="py-3 px-3">{activity.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
