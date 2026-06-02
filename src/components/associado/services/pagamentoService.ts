
import { supabase } from '@/integrations/supabase/client';
import { Pagamento, SituacaoPagamento } from '../types/pagamentos';

// Função para obter os pagamentos do associado logado
export const obterPagamentosAssociado = async (associadoId: string): Promise<Pagamento[]> => {
  if (!associadoId) return [];
  
  // Busca pagamentos no banco de dados
  const { data, error } = await supabase
    .from('pagamentos_associado')
    .select('*')
    .eq('associado_id', associadoId)
    .order('data_pagamento', { ascending: false });
    
  if (error) {
    console.error('Erro ao buscar pagamentos:', error);
    throw error;
  }
  
  return data as Pagamento[];
};

// Função para verificar se o pagamento do associado está em dia
export const verificarSituacaoPagamento = async (associadoId: string): Promise<SituacaoPagamento> => {
  if (!associadoId) {
    return { emDia: false };
  }
  
  try {
    // Busca o último pagamento realizado
    const { data: ultimoPagamento, error } = await supabase
      .from('pagamentos_associado')
      .select('*')
      .eq('associado_id', associadoId)
      .eq('status', 'pago')
      .order('data_pagamento', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) throw error;
    
    if (!ultimoPagamento) {
      return { emDia: false };
    }
    
    // Verifica se o pagamento está dentro do período de validade (1 ano)
    const dataPagamento = new Date(ultimoPagamento.data_pagamento);
    const dataValidade = new Date(dataPagamento);
    dataValidade.setFullYear(dataValidade.getFullYear() + 1);
    
    const hoje = new Date();
    const emDia = hoje <= dataValidade;
    
    // Calcula dias restantes até o vencimento
    const diasRestantes = emDia 
      ? Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)) 
      : 0;
    
    return { 
      emDia, 
      ultimoPagamento: ultimoPagamento as Pagamento, 
      proximoVencimento: dataValidade.toISOString(),
      diasRestantes
    };
    
  } catch (error) {
    console.error('Erro ao verificar situação do pagamento:', error);
    return { emDia: false };
  }
};
