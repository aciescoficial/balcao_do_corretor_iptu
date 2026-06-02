import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDashboardStats, DashboardStats } from '../services/statsService';
import { fetchRecentActivity, RecentActivity } from '../services/activityService';
import { checkSystemStatus, SystemStatus } from '../services/systemStatusService';
import { useTimeout } from './useTimeout';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

// Cache timeout in milliseconds (5 minutes)
const CACHE_TIMEOUT = 5 * 60 * 1000;

export const useDashboardData = () => {
  const { user } = useAuth(); // Get the authenticated user
  
  const [stats, setStats] = useState<DashboardStats>({
    associados: 0,
    empresas: 0,
    pendentes: 0,
    carteirasPendentes: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    asaas: { active: false, message: 'Verificando...' },
    stripe: { active: false, message: 'Verificando...' },
    emails: { active: false, message: 'Verificando...' }
  });

  // Cache timestamp references
  const lastFetchTimeRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Use timeout hook with increased timeout values
  const statsTimeout = useTimeout(5000, { 
    associados: 0,
    empresas: 0,
    pendentes: 0,
    carteirasPendentes: 0
  });
  
  const activityTimeout = useTimeout(5000, []); 
  
  const statusTimeout = useTimeout(4000, { 
    asaas: { active: false, message: 'Verificação falhou (timeout)' },
    stripe: { active: false, message: 'Verificação falhou (timeout)' },
    emails: { active: false, message: 'Verificação falhou (timeout)' }
  });

  const fetchDashboardData = useCallback(async (forceRefresh: boolean = false) => {
    // Check if we should use cached data
    const currentTime = Date.now();
    if (
      !forceRefresh && 
      lastFetchTimeRef.current && 
      currentTime - lastFetchTimeRef.current < CACHE_TIMEOUT
    ) {
      console.log('Using cached dashboard data');
      return;
    }

    setLoading(true);
    
    try {
      if (!user) {
        console.log('No authenticated user, skipping dashboard data fetch');
        setLoading(false);
        return;
      }
      
      console.log('Fetching fresh dashboard data');
      
      // Fetch data in parallel using the timeout wrapper
      const statsPromise = statsTimeout.withTimeout(fetchDashboardStats(), 'fetchStats');
      const activityPromise = activityTimeout.withTimeout(fetchRecentActivity(), 'fetchActivity');
      const statusPromise = statusTimeout.withTimeout(checkSystemStatus(), 'checkStatus');
      
      // Use Promise.allSettled to handle partial failures
      const [statsResult, activityResult, statusResult] = await Promise.allSettled([
        statsPromise,
        activityPromise,
        statusPromise
      ]);
      
      // Only update state if the component is still mounted
      if (!isMountedRef.current) return;
      
      // Handle stats result
      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      } else {
        console.error('Failed to fetch stats:', statsResult.reason);
      }
      
      // Handle activity result
      if (activityResult.status === 'fulfilled') {
        setRecentActivity(activityResult.value);
      } else {
        console.error('Failed to fetch recent activity:', activityResult.reason);
      }
      
      // Handle system status result
      if (statusResult.status === 'fulfilled') {
        setSystemStatus(statusResult.value);
      } else {
        console.error('Failed to fetch system status:', statusResult.reason);
      }
      
      // Update the last fetch timestamp
      lastFetchTimeRef.current = currentTime;
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro ao carregar dados do dashboard",
        description: "Tente atualizar a página",
        variant: "destructive"
      });
    } finally {
      // Always set loading to false, even if there are errors
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [statsTimeout, activityTimeout, statusTimeout, user]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Set a maximum timeout for the entire loading process
    const loadingTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }, 8000); 
    
    fetchDashboardData();
    
    // Clean up on unmount
    return () => {
      isMountedRef.current = false;
      clearTimeout(loadingTimeout);
    };
  }, [fetchDashboardData]);

  const refreshData = useCallback(() => {
    return fetchDashboardData(true);
  }, [fetchDashboardData]);

  return {
    stats,
    recentActivity,
    loading,
    systemStatus,
    refreshData
  };
};
