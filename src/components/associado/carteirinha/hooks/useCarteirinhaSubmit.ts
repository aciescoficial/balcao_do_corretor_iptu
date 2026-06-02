
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { EnderecoFormValues } from '../endereco-form/schema';

// Types to better organize the code
interface CarteirinhaSolicitacaoData {
  associado_id: string;
  nome: string;
  sobrenome: string;
  endereco_entrega: string;
  complemento?: string | null;
  valor: number;
  status: string;
  email?: string;
  tipo_entrega: string;
}

interface PaymentGatewayParams {
  solicitacaoId: string;
  valor: number;
  userData: any;
  description: string;
}

interface UseCarteirinhaSubmitProps {
  userData: any;
  taxaEntrega: number;
  entregaMethod: 'retirada' | 'entrega';
  retiradaLocation: 'grafica' | 'aciesc';
  paymentGateway: 'asaas' | 'stripe';
  navigateToPayment: (url: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCarteirinhaSubmit = ({
  userData,
  taxaEntrega,
  entregaMethod,
  retiradaLocation,
  paymentGateway,
  navigateToPayment,
  setIsLoading
}: UseCarteirinhaSubmitProps) => {
  const { toast } = useToast();

  // Function to prepare solicitation data
  const prepareSolicitacaoData = (data: EnderecoFormValues): CarteirinhaSolicitacaoData => {
    // Determine the address or pickup location
    let enderecoCompleto = '';
    let tipoEntrega = '';
    
    if (entregaMethod === 'entrega') {
      enderecoCompleto = `${data.endereco}, ${data.numero}, ${data.bairro}, ${data.cidade}-${data.estado}, ${data.cep}`;
      tipoEntrega = 'entrega';
    } else {
      enderecoCompleto = retiradaLocation === 'grafica' ? 'Retirada na Gráfica Parceira' : 'Retirada na sede da ACIESC';
      tipoEntrega = `retirada_${retiradaLocation}`;
    }

    // Determine the payment status
    const valor = entregaMethod === 'entrega' ? taxaEntrega : 0;
    const status = valor > 0 ? 'pendente_pagamento' : 'aguardando_producao';
    
    return {
      associado_id: userData.id,
      nome: data.nome || userData.nome,
      sobrenome: data.sobrenome || userData.sobrenome,
      endereco_entrega: enderecoCompleto,
      complemento: entregaMethod === 'entrega' ? data.complemento : null,
      valor,
      status,
      email: userData.email,
      tipo_entrega: tipoEntrega
    };
  };

  // Function to save solicitation to database
  const saveSolicitacao = async (solicitacaoData: CarteirinhaSolicitacaoData) => {
    // Contorna o erro de tipo usando type assertion
    const supabaseAny = supabase as any;
    
    const { data, error } = await supabaseAny
      .from('carteirinha_solicitacoes')
      .insert(solicitacaoData)
      .select('id')
      .single();
    
    if (error) throw error;
    return data;
  };

  // Function to handle Asaas payment
  const processAsaasPayment = async ({ solicitacaoId, valor, userData, description }: PaymentGatewayParams) => {
    const { data: paymentData, error: paymentError } = await supabase.functions.invoke('asaas-payment', {
      body: {
        customer: {
          name: `${userData.nome} ${userData.sobrenome}`,
          email: userData?.email,
          cpfCnpj: userData?.cpf
        },
        value: valor,
        description,
        solicitacaoId
      }
    });
    
    if (paymentError) throw paymentError;
    return paymentData.invoiceUrl;
  };

  // Function to handle Stripe payment
  const processStripePayment = async ({ solicitacaoId, valor, userData, description }: PaymentGatewayParams) => {
    const { data: paymentData, error: paymentError } = await supabase.functions.invoke('stripe-payment', {
      body: {
        customerId: userData?.id,
        customerEmail: userData?.email,
        amount: valor * 100, // Stripe recebe valores em centavos
        description,
        solicitacaoId
      }
    });
    
    if (paymentError) throw paymentError;
    return paymentData.url;
  };

  // Main function to handle form submission
  const handleSubmit = async (data: EnderecoFormValues) => {
    try {
      setIsLoading(true);
      
      if (!userData?.id) {
        throw new Error("Dados do usuário não encontrados");
      }
      
      // Step 1: Prepare the solicitation data
      const solicitacaoData = prepareSolicitacaoData(data);
      
      // Step 2: Save the solicitation to the database
      const solicitacao = await saveSolicitacao(solicitacaoData);
      
      // Step 3: Process payment if needed
      if (solicitacaoData.valor > 0) {
        const paymentParams = {
          solicitacaoId: solicitacao.id,
          valor: solicitacaoData.valor,
          userData,
          description: `Taxa de carteirinha - Solicitação #${solicitacao.id}`
        };

        // Step 4: Process payment through the selected gateway
        const paymentUrl = paymentGateway === 'asaas' 
          ? await processAsaasPayment(paymentParams)
          : await processStripePayment(paymentParams);
        
        // Step 5: Redirect to payment page
        navigateToPayment(paymentUrl);
      } else {
        // No payment needed, show success message
        toast({
          title: "Solicitação enviada",
          description: "Sua carteirinha foi solicitada com sucesso e está em produção.",
        });
        
        // Redirect to success page
        navigateToPayment('/pagamento-sucesso?status=gratuito');
      }
    } catch (error: any) {
      console.error('Erro ao solicitar carteirinha:', error);
      toast({
        title: "Erro ao processar solicitação",
        description: error.message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return {
    handleSubmit
  };
};
