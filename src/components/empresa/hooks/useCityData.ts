
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCityData = () => {
  const [cidades, setCidades] = useState<string[]>([]);

  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('cidade')
          .order('cidade');
        
        if (error) throw error;
        
        const uniqueCidades = [...new Set(data.map(item => item.cidade))];
        setCidades(uniqueCidades);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCidades();
  }, []);

  return { cidades };
};
