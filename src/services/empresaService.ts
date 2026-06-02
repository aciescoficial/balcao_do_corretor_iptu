
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from './baseService';
import { EmpresaData } from '@/types/empresa';

class EmpresaService extends BaseService {
  async fetchPendingEmpresas() {
    try {
      this.logInfo("Fetching pending empresas");
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });
      
      if (error) {
        this.handleError(error, "Erro ao buscar empresas pendentes");
      }
      
      this.logInfo(`Fetched ${data?.length || 0} pending empresas`);
      return data || [];
    } catch (error) {
      this.handleError(error, "Erro ao buscar empresas pendentes");
    }
  }

  async updateEmpresaStatus(id: string, status: 'ativo' | 'inativo') {
    try {
      this.logInfo(`Updating empresa ${id} status to ${status}`);
      
      const { error } = await supabase
        .from('empresas')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        this.handleError(error, "Erro ao atualizar status da empresa");
      }
      
      this.logInfo(`Successfully updated empresa ${id} status`);
      return true;
    } catch (error) {
      this.handleError(error, "Erro ao atualizar status da empresa");
    }
  }

  async getCompaniesPaginated(
    page: number = 1,
    pageSize: number = 10,
    filters: { searchTerm?: string } = {}
  ) {
    try {
      let query = supabase
        .from('empresas')
        .select('*', { count: 'exact' });
      
      if (filters.searchTerm) {
        query = query.or(
          `nome_fantasia.ilike.%${filters.searchTerm}%,` +
          `razao_social.ilike.%${filters.searchTerm}%,` +
          `cnpj.ilike.%${filters.searchTerm}%`
        );
      }
      
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        this.handleError(error, "Erro ao buscar empresas");
      }
      
      return {
        data: data || [],
        count: count || 0
      };
    } catch (error) {
      this.handleError(error, "Erro ao buscar empresas");
    }
  }
}

export const empresaService = new EmpresaService();
