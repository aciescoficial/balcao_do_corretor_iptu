
import React, { useEffect, useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { useDashboardInitialize } from '@/components/dashboard/hooks/useDashboardInitialize';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import AssociadoDashboard from '@/components/dashboard/AssociadoDashboard';
import EmpresasDashboard from '@/components/empresa/dashboard/EmpresasDashboard';
import NotificationManager from '@/components/dashboard/NotificationManager';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { refreshData } = useDashboardData();
  const handleRefresh = useMemo(() => refreshData, [refreshData]);
  const { user } = useDashboardInitialize(handleRefresh);

  // Handle notification demo messages
  useEffect(() => {
    // Component mount effect
  }, []);

  // Redirect to company profile if user is company
  if (user?.role === 'empresa') {
    return <EmpresasDashboard />;
  }

  // Check if user is an associate
  const isAssociado = user?.role === 'user' && user?.associado_id;

  return (
    <>
      <NotificationManager />
      {isAssociado ? <AssociadoDashboard /> : <AdminDashboard />}
    </>
  );
};

export default React.memo(Dashboard);
