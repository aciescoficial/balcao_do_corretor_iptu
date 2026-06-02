
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from '@/services/baseService';

class EmpresaStatusService extends BaseService {
  async updateEmpresaStatus(empresaId: string, status: 'ativo' | 'pendente' | 'inativo'): Promise<boolean> {
    const { error } = await supabase
      .from('empresas')
      .update({ status })
      .eq('id', empresaId);
    
    if (error) {
      this.handleError(error, 'Error updating company status');
      return false;
    }
    
    return true;
  }

  async fetchPendingEmpresas() {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('status', 'pendente')
      .order('created_at', { ascending: false });
      
    if (error) {
      this.handleError(error, 'Error fetching pending companies');
      throw error;
    }
    
    return data || [];
  }
}

export const empresaStatusService = new EmpresaStatusService();
