
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemConfigKey } from '../../types/systemConfig';

export const useSystemConfig = () => {
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConfigValues();
  }, []);

  const fetchConfigValues = async () => {
    setIsLoading(true);
    try {
      // Load configs from database table
      const { data, error } = await supabase
        .from('system_config')
        .select('key, value');

      if (error) throw error;

      // Convert array of configs to a key-value object
      const configObject: Record<string, string> = {};
      (data || []).forEach(item => {
        configObject[item.key] = item.value;
      });

      // Also load Google Maps API key from localStorage for compatibility
      const mapsApiKey = localStorage.getItem('google_maps_api_key');
      if (mapsApiKey && !configObject['google_maps_api_key']) {
        configObject['google_maps_api_key'] = mapsApiKey;
      }

      setConfigValues(configObject);
    } catch (error) {
      console.error('Error fetching system config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_config')
        .upsert({
          key, 
          value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setConfigValues(prev => ({
        ...prev,
        [key]: value
      }));

      return true;
    } catch (error) {
      console.error('Error saving system config:', error);
      throw error;
    }
  };

  return {
    configValues,
    isLoading,
    saveConfig,
    fetchConfigValues
  };
};
