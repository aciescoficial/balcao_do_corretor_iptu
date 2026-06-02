
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';

interface SystemConfigState {
  showSystemMessages: boolean;
  isLoading: boolean;
  hasError: boolean;
}

export function useSystemConfig(debug: boolean = false) {
  const [state, setState] = useState<SystemConfigState>({
    showSystemMessages: true, // Default to showing system messages
    isLoading: true,
    hasError: false
  });

  // Debug logger function
  const logDebug = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[useSystemConfig] ${message}`, data || '');
    }
  }, [debug]);

  // Load system configuration
  useEffect(() => {
    const loadSystemConfig = async () => {
      try {
        // Try localStorage first for immediate effect
        const storedConfig = localStorage.getItem('systemConfig');
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          const showSystemMessages = parsedConfig.showSystemMessages ?? true;
          
          setState(prev => ({ 
            ...prev,
            showSystemMessages,
            isLoading: false
          }));
          logDebug('Loaded systemConfig from localStorage', { showSystemMessages });
          return;
        }
        
        // Fall back to database
        const { data, error } = await extendedSupabase
          .from('configuracoes')
          .select('*')
          .eq('tipo', 'sistema')
          .maybeSingle();
        
        if (error) {
          logDebug('No system config found, using defaults', error);
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        if (data?.configuracoes) {
          const showSystemMessages = data.configuracoes.showSystemMessages ?? true;
          setState(prev => ({ 
            ...prev,
            showSystemMessages,
            isLoading: false
          }));
          
          // Store for future use
          localStorage.setItem('systemConfig', JSON.stringify(data.configuracoes));
          logDebug('Loaded systemConfig from database', { showSystemMessages });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading system config:', error);
        setState(prev => ({ 
          ...prev,
          hasError: true,
          isLoading: false
        }));
      }
    };
    
    loadSystemConfig();
    
    // Listen for config updates
    const handleConfigUpdate = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.showSystemMessages === 'boolean') {
        setState(prev => ({ 
          ...prev,
          showSystemMessages: event.detail.showSystemMessages 
        }));
        logDebug('Config updated via event', { showSystemMessages: event.detail.showSystemMessages });
      }
    };
    
    window.addEventListener('system-config-updated', handleConfigUpdate as EventListener);
    
    return () => {
      window.removeEventListener('system-config-updated', handleConfigUpdate as EventListener);
    };
  }, [logDebug]);

  const toggleSystemMessages = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showSystemMessages: show }));
    // Also update localStorage for persistence
    try {
      const existingConfig = localStorage.getItem('systemConfig');
      const config = existingConfig ? JSON.parse(existingConfig) : {};
      localStorage.setItem('systemConfig', JSON.stringify({
        ...config,
        showSystemMessages: show
      }));

      // You might want to update the database configuration as well
      extendedSupabase
        .from('configuracoes')
        .upsert({
          tipo: 'sistema',
          configuracoes: { ...config, showSystemMessages: show }
        })
        .then(({ error }) => {
          if (error) console.error('Error updating system config in database', error);
        });
    } catch (e) {
      console.error('Error updating systemConfig in localStorage:', e);
    }
  }, []);

  return {
    ...state,
    toggleSystemMessages
  };
}
