import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AssociadoPaymentParams {
  associadoInteresseId: string;
  associationTypeId: string;
  email: string;
  nome: string;
  sobrenome: string;
  cpf: string;
}

/**
 * Generate payment for associate based on association type
 */
export const generateAssociadoPayment = async ({
  associadoInteresseId,
  associationTypeId,
  email,
  nome,
  sobrenome,
  cpf
}: AssociadoPaymentParams): Promise<{ paymentUrl: string; paymentId: string }> => {
  try {
    console.log('Starting payment generation with params:', { 
      associadoInteresseId, associationTypeId, email, nome, sobrenome, cpf 
    });
    
    // Get association type details
    const { data: associationType, error: typeError } = await supabase
      .from('association_types')
      .select('*')
      .eq('id', associationTypeId)
      .single();
      
    if (typeError) {
      console.error('Error fetching association type:', typeError);
      throw new Error(`Failed to fetch association type: ${typeError.message}`);
    }
    
    if (!associationType) {
      console.error('Association type not found');
      throw new Error('Association type not found');
    }
    
    console.log('Association type found:', associationType);
    
    // Create payment in Asaas
    try {
      console.log('Invoking asaas-payment function with:', {
        customer: {
          name: `${nome} ${sobrenome}`,
          email,
          cpfCnpj: cpf
        },
        value: associationType.value,
        description: `Associação ACIESC - ${associationType.title}`,
        solicitacaoId: associadoInteresseId
      });
      
      const { data, error } = await supabase.functions.invoke('asaas-payment', {
        body: {
          customer: {
            name: `${nome} ${sobrenome}`,
            email,
            cpfCnpj: cpf
          },
          value: associationType.value,
          description: `Associação ACIESC - ${associationType.title}`,
          solicitacaoId: associadoInteresseId
        }
      });

      if (error) {
        console.error('Error invoking asaas-payment function:', error);
        throw new Error(`Payment generation failed: ${error.message}`);
      }
      
      console.log('Payment generated successfully:', data);
      
      if (!data || !data.invoiceUrl) {
        console.error('Invalid response from asaas-payment function, missing invoiceUrl:', data);
        throw new Error('Invalid response from payment provider');
      }
      
      // Update the interesse record with payment info
      const { error: updateError } = await supabase
        .from('associado_interesse')
        .update({
          pagamento_url: data.invoiceUrl,
          status: 'aprovado'
        })
        .eq('id', associadoInteresseId);
        
      if (updateError) {
        console.error('Error updating interesse record:', updateError);
        throw new Error(`Failed to update interesse record: ${updateError.message}`);
      }
      
      // Create an entry in pagamentos_associado
      const anoAtual = new Date().getFullYear();
      
      // We need a placeholder associado_id for now because it's required
      // This will be properly updated once the actual associado record is created
      const placeholderAssociadoId = associadoInteresseId; // Using interesse ID as temporary placeholder
      
      // Once the associado record is created, this payment will be linked
      // But for now, we just store the data for reference
      const { error: paymentError } = await supabase
        .from('pagamentos_associado')
        .insert({
          associado_id: placeholderAssociadoId, // Add the required associado_id field
          valor: associationType.value,
          data_pagamento: new Date().toISOString(),
          status: 'pendente',
          metodo: associationType.payment_methods[0] || 'boleto',
          origem: 'asaas',
          descricao: `Associação ACIESC - ${associationType.title}`,
          ano_referencia: anoAtual
        });
      
      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
        // Continue anyway since this is just for record keeping
      }
      
      return {
        paymentUrl: data.invoiceUrl,
        paymentId: data.id
      };
    } catch (invokeError) {
      console.error('Error in asaas-payment function:', invokeError);
      throw new Error(`Payment generation failed: ${invokeError.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error generating payment:', error);
    throw error;
  }
};

/**
 * Check payment status with payment provider
 */
export const checkPaymentStatus = async (paymentId: string): Promise<{
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
  isPaid: boolean;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('asaas-payment-check', {
      body: {
        paymentId
      }
    });

    if (error) throw error;
    
    // Check if payment is in one of the "paid" statuses
    const isPaid = ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(data.status);
    
    return {
      status: data.status,
      isPaid
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};
