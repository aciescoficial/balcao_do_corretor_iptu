import { useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

export const useDashboardInitialize = (handleRefresh: () => void) => {
  const { user } = useAuth();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!user) {
      console.log('No authenticated user, dashboard might not show data');
      timeoutId = setTimeout(() => {
        console.log('Triggering refresh to ensure auth state is current');
        handleRefresh();
      }, 1500);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, handleRefresh]);

  return { user };
};
