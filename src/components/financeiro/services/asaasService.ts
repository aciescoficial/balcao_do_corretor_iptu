
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod, AssociationType } from '../types';

interface AsaasPaymentLinkResponse {
  id: string;
  url: string;
}

export const generatePaymentLink = async (
  associationType: AssociationType, 
  externalReference?: string
): Promise<string> => {
  try {
    // Get current payment gateway
    const { data: gatewayConfig } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'PAYMENT_GATEWAY')
      .single();
    
    const paymentGateway = gatewayConfig?.value || 'asaas';
    
    if (paymentGateway === 'stripe') {
      // Usar Stripe para gerar o link de pagamento
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          customerId: externalReference || '',
          customerEmail: '',
          amount: associationType.value * 100, // Stripe usa centavos
          description: `Associação ACIESC - ${associationType.title}`,
          solicitacaoId: externalReference || ''
        }
      });
      
      if (error) {
        console.error('Error generating payment link:', error);
        throw new Error(`Erro ao gerar link de pagamento: ${error.message}`);
      }
      
      return data.url;
    } else {
      // Default to Asaas
      // Default to the first payment method if multiple are available
      const billingType = mapToBillingType(associationType.payment_methods[0]);
      
      const { data, error } = await supabase.functions.invoke('asaas-integration', {
        body: {
          path: 'create-payment-link',
          name: `Associação ACIESC - ${associationType.title}`,
          description: associationType.description || `Pagamento para ${associationType.title}`,
          value: associationType.value,
          billingType: billingType,
          chargeType: associationType.max_installments && associationType.max_installments > 1 ? 'INSTALLMENT' : 'DETACHED',
          dueDateLimitDays: 5,
          maxInstallmentCount: associationType.max_installments || 1,
          externalReference: externalReference
        }
      });

      if (error) {
        console.error('Error generating payment link:', error);
        throw new Error(`Erro ao gerar link de pagamento: ${error.message}`);
      }

      return data.url;
    }
  } catch (error) {
    console.error('Error calling payment API:', error);
    throw error;
  }
};

export const generateSubscriptionLink = async (associationType: AssociationType): Promise<string> => {
  try {
    // Get current payment gateway
    const { data: gatewayConfig } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'PAYMENT_GATEWAY')
      .single();
    
    const paymentGateway = gatewayConfig?.value || 'asaas';
    
    if (paymentGateway === 'stripe') {
      // Gerar link de assinatura no Stripe
      // Nota: Para assinaturas no Stripe, seria necessário criar um produto e preço recorrente
      // Por simplicidade, vamos apenas chamar a função de pagamento único aqui
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          customerId: '',
          customerEmail: '',
          amount: associationType.value * 100, // Stripe usa centavos
          description: `Assinatura ACIESC - ${associationType.title}`,
          solicitacaoId: ''
        }
      });
      
      if (error) {
        console.error('Error generating subscription link:', error);
        throw new Error(`Erro ao gerar link de assinatura: ${error.message}`);
      }
      
      return data.url;
    } else {
      // Default to Asaas
      const billingType = mapToBillingType(associationType.payment_methods[0]);
      
      const { data, error } = await supabase.functions.invoke('asaas-integration', {
        body: {
          path: 'create-payment-link',
          name: `Assinatura ACIESC - ${associationType.title}`,
          description: associationType.description || `Assinatura para ${associationType.title}`,
          value: associationType.value,
          billingType: billingType,
          chargeType: 'RECURRENT',
          subscriptionCycle: 'MONTHLY'
        }
      });

      if (error) {
        console.error('Error generating subscription link:', error);
        throw new Error(`Erro ao gerar link de assinatura: ${error.message}`);
      }

      return data.url;
    }
  } catch (error) {
    console.error('Error calling payment API:', error);
    throw error;
  }
};

// Map our payment method types to Asaas billing types
const mapToBillingType = (paymentMethod: PaymentMethod): string => {
  switch (paymentMethod) {
    case 'cartao':
      return 'CREDIT_CARD';
    case 'pix':
      return 'PIX';
    case 'boleto':
      return 'BOLETO';
    default:
      return 'UNDEFINED';
  }
};
