
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from "@/components/audit/auditLogService";
import { EmpresaResponse } from '../types/empresaSearchTypes';
import { addCoordinatesToCompany } from '../utils/coordinateUtils';
import { NichoType } from '../../types';

export const searchNearbyCompanies = async (latitude: number, longitude: number) => {
  const { data, error } = await supabase
    .from('empresas')
    .select('*');
  
  if (error) throw error;
  
  return data.map((company: EmpresaResponse) => addCoordinatesToCompany(company));
};

export const searchByTerm = async (
  searchType: 'nome' | 'cnpj' | 'nicho' | 'cidade', 
  searchTerm: string
) => {
  let query = supabase
    .from('empresas')
    .select('*');
  
  if (searchType === 'nome') {
    query = query.or(`nome_fantasia.ilike.%${searchTerm}%,razao_social.ilike.%${searchTerm}%`);
  } else if (searchType === 'cnpj') {
    query = query.ilike('cnpj', `%${searchTerm}%`);
  } else if (searchType === 'nicho') {
    query = query.ilike('nicho', `%${searchTerm}%`);
  } else if (searchType === 'cidade') {
    query = query.ilike('cidade', `%${searchTerm}%`);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  await logOperation({
    eventType: 'export',
    entityType: 'empresa',
    details: `Pesquisa por ${searchType}: ${searchTerm}`,
    recordCount: data?.length || 0
  });
  
  return data?.map((company: EmpresaResponse) => addCoordinatesToCompany(company)) || [];
};

export const searchByCityAndNiche = async (cidadeFilter: string, nichoFilter: string) => {
  let query = supabase
    .from('empresas')
    .select('*');
  
  if (cidadeFilter) {
    query = query.eq('cidade', cidadeFilter);
  }
  
  if (nichoFilter) {
    // Cast nichoFilter to NichoType to satisfy TypeScript
    // This will ensure we're using a valid nicho type at runtime
    query = query.eq('nicho', nichoFilter as NichoType);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  await logOperation({
    eventType: 'export',
    entityType: 'empresa',
    details: `Pesquisa por Cidade: ${cidadeFilter || 'Todas'} e Nicho: ${nichoFilter || 'Todos'}`,
    recordCount: data?.length || 0
  });
  
  return data?.map((company: EmpresaResponse) => addCoordinatesToCompany(company)) || [];
};
