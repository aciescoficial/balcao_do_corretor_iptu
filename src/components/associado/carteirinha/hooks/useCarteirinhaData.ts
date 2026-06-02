
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCarteirinhaData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [taxaEntrega, setTaxaEntrega] = useState(15.00); // Valor padrão
  const [paymentGateway, setPaymentGateway] = useState<'asaas' | 'stripe'>('asaas');
  const { toast } = useToast();

  // Carrega os dados do associado logado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: associado } = await supabase
            .from('associados')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();
          
          if (associado) {
            setUserData(associado);
          }
        }
        
        // Carrega a configuração de pagamento
        const { data: configData } = await supabase
          .from('system_config')
          .select('*')
          .in('key', ['PAYMENT_GATEWAY', 'ID_CARD_FEE'])
          .order('key');
        
        if (configData) {
          const paymentConfig = configData.find(item => item.key === 'PAYMENT_GATEWAY');
          const feeConfig = configData.find(item => item.key === 'ID_CARD_FEE');
          
          if (paymentConfig) {
            setPaymentGateway(paymentConfig.value as 'asaas' | 'stripe');
          }
          
          if (feeConfig) {
            setTaxaEntrega(parseFloat(feeConfig.value));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus dados.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  return {
    userData,
    taxaEntrega,
    isLoading,
    paymentGateway,
    setIsLoading
  };
};
