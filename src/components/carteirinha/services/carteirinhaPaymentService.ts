
import { supabase } from '@/integrations/supabase/client';
import { updateCarteirinhaSolicitacao } from './carteirinhaSolicitacaoService';

export async function verifyCarteirinhaPayment(solicitacaoId: string): Promise<{ paid: boolean, status: string }> {
  try {
    const { data, error } = await supabase
      .from('carteirinha_solicitacoes')
      .select('status, pagamento_id')
      .eq('id', solicitacaoId)
      .single();
    
    if (error) throw error;
    
    // Check if status is already indicating payment (or free pickup)
    if (data.status === 'aguardando_producao' || 
        data.status === 'em_producao' || 
        data.status === 'pronta_entrega' || 
        data.status === 'concluida') {
      return { paid: true, status: data.status };
    }
    
    // If there's a payment ID, check with the payment gateway
    if (data.pagamento_id) {
      // Get the payment gateway first
      const { data: configData } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'PAYMENT_GATEWAY')
        .single();
      
      const paymentGateway = configData?.value || 'asaas';
      
      if (paymentGateway === 'asaas') {
        return await verifyAsaasPayment(solicitacaoId, data.pagamento_id);
      } else if (paymentGateway === 'stripe') {
        return await verifyStripePayment(solicitacaoId, data.pagamento_id);
      }
    }
    
    return { paid: false, status: data.status };
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    throw error;
  }
}

async function verifyAsaasPayment(solicitacaoId: string, paymentId: string): Promise<{ paid: boolean, status: string }> {
  const { data: paymentData, error: paymentError } = await supabase.functions.invoke('asaas-payment-check', {
    body: { paymentId }
  });
  
  if (paymentError) throw paymentError;
  
  // If payment is confirmed, update the status
  if (paymentData.status === 'CONFIRMED' || paymentData.status === 'RECEIVED') {
    await updateCarteirinhaSolicitacao(solicitacaoId, {
      status: 'aguardando_producao'
    });
    
    return { paid: true, status: 'aguardando_producao' };
  }
  
  return { paid: false, status: 'pendente_pagamento' };
}

async function verifyStripePayment(solicitacaoId: string, sessionId: string): Promise<{ paid: boolean, status: string }> {
  const { data: paymentData, error: paymentError } = await supabase.functions.invoke('stripe-payment-check', {
    body: { sessionId }
  });
  
  if (paymentError) throw paymentError;
  
  // If payment is paid, update the status
  if (paymentData.status === 'paid') {
    await updateCarteirinhaSolicitacao(solicitacaoId, {
      status: 'aguardando_producao'
    });
    
    return { paid: true, status: 'aguardando_producao' };
  }
  
  return { paid: false, status: 'pendente_pagamento' };
}
