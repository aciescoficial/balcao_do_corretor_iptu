
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { empresaService } from '../services/empresaService';
import { EmpresaData } from '../types';

export const useLatestCompanies = (limit: number = 3) => {
  const [companies, setCompanies] = useState<EmpresaData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestCompanies = async () => {
      try {
        setLoading(true);
        const data = await empresaService.getLatestCompanies(limit);
        
        const companiesWithCoords = data.map(company => ({
          ...company,
          latitude: company.latitude || -15.7801 + (Math.random() - 0.5) * 0.1,
          longitude: company.longitude || -47.9292 + (Math.random() - 0.5) * 0.1
        }));
        
        setCompanies(companiesWithCoords);
      } catch (error) {
        console.error("Error fetching latest companies:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as empresas recentes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCompanies();
  }, [limit, toast]);

  return { companies, loading };
};
