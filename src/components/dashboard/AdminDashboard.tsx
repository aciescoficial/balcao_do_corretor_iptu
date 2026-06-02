import React, { useMemo } from 'react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/components/auth/AuthProvider';

const AdminDashboard: React.FC = () => {
  const { stats, recentActivity, loading, systemStatus, refreshData } = useDashboardData();
  const handleRefresh = useMemo(() => refreshData, [refreshData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Dashboard</h1>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="small" text="" centered={false} className="mr-1" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-1" />
              Atualizar dados
            </>
          )}
        </Button>
      </div>
      
      <DashboardStats stats={stats} loading={loading} />
      <RecentActivity recentActivity={recentActivity} loading={loading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions />
        <SystemStatus systemStatus={systemStatus} />
      </div>
    </div>
  );
};

export default AdminDashboard;
