
import { supabase } from '@/integrations/supabase/client';
import { CarteirinhaSolicitacao } from '../types';

export async function createCarteirinhaSolicitacao(data: Omit<CarteirinhaSolicitacao, 'id' | 'created_at' | 'updated_at'>): Promise<CarteirinhaSolicitacao> {
  const { data: result, error } = await supabase
    .from('carteirinha_solicitacoes')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function getCarteirinhaSolicitacoes(options: { 
  status?: string,
  associado_id?: string,
  page?: number, 
  pageSize?: number 
} = {}): Promise<{ solicitacoes: CarteirinhaSolicitacao[], count: number }> {
  const { status, associado_id, page = 1, pageSize = 10 } = options;
  
  let query = supabase
    .from('carteirinha_solicitacoes')
    .select('*', { count: 'exact' });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (associado_id) {
    query = query.eq('associado_id', associado_id);
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  const { data, error, count } = await query
    .range(start, end)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return { 
    solicitacoes: data as CarteirinhaSolicitacao[], 
    count: count || 0 
  };
}

export async function updateCarteirinhaSolicitacao(id: string, data: Partial<CarteirinhaSolicitacao>): Promise<CarteirinhaSolicitacao> {
  const { data: result, error } = await supabase
    .from('carteirinha_solicitacoes')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return result;
}
