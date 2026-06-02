
import React from 'react';
import { Users, Building, Clock, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    associados: number;
    empresas: number;
    pendentes: number;
    carteirasPendentes: number;
  };
  loading: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="wp-card animate-pulse">
            <div className="h-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="wp-card flex items-center">
        <div className="mr-4 bg-blue-100 p-3 rounded-full">
          <Users className="h-6 w-6 text-wp-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Associados</p>
          <p className="text-2xl font-semibold">{stats.associados}</p>
        </div>
      </div>
      
      <div className="wp-card flex items-center">
        <div className="mr-4 bg-green-100 p-3 rounded-full">
          <Building className="h-6 w-6 text-wp-success" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Empresas Conveniadas</p>
          <p className="text-2xl font-semibold">{stats.empresas}</p>
        </div>
      </div>
      
      <div className="wp-card flex items-center">
        <div className="mr-4 bg-yellow-100 p-3 rounded-full">
          <Clock className="h-6 w-6 text-wp-warning" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Aprovações Pendentes</p>
          <p className="text-2xl font-semibold">{stats.pendentes}</p>
        </div>
      </div>
      
      <div className="wp-card flex items-center">
        <div className="mr-4 bg-purple-100 p-3 rounded-full">
          <Calendar className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Carteirinhas Pendentes</p>
          <p className="text-lg font-semibold">{stats.carteirasPendentes}</p>
        </div>
      </div>
    </div>
  );
};
