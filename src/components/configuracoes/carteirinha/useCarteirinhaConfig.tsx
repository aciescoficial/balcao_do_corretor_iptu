
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCardSettings } from '@/components/carteirinha/hooks/useCardSettings';
import { getCarteirinhaConfig, updateCarteirinhaConfig } from '@/components/carteirinha/services/carteirinhaConfigService';
import { ConveniadoData } from '@/components/carteirinha/types';

export const useCarteirinhaConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [carteirinhaFee, setCarteirinhaFee] = useState<number>(15.00);
  const [paymentGateway, setPaymentGateway] = useState<'asaas' | 'stripe'>('asaas');
  const [graficaEndereco, setGraficaEndereco] = useState<string>('Rua das Impressões, 123');
  const [aciescEndereco, setAciescEndereco] = useState<string>('Avenida Principal, 456');
  const [permiteRetirada, setPermiteRetirada] = useState<boolean>(true);
  const [permiteEntrega, setPermiteEntrega] = useState<boolean>(true);
  const { cardSettings, updateCardSetting } = useCardSettings();
  const { toast } = useToast();
  
  // Create a complete ConveniadoData object for preview
  const previewData: ConveniadoData = {
    id: '1',
    nome: 'João',
    sobrenome: 'Silva',
    creci: '12345',
    cpf: '123.456.789-00',
    email: 'joao@exemplo.com',
    telefone: '(48) 99999-9999',
    foto: null,
    foto_url: undefined,
    validade: '2025-12-31',
    status: 'ativo',
    tipo_associado: 'Padrão',
    data_associacao: '2023-01-01'
  };

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const config = await getCarteirinhaConfig();
      setCarteirinhaFee(config.fee);
      setPaymentGateway(config.paymentGateway);
      
      // Load additional pickup location settings
      const { data: configData } = await supabase
        .from('system_config')
        .select('*')
        .in('key', [
          'GRAFICA_ENDERECO',
          'ACIESC_ENDERECO',
          'PERMITE_RETIRADA',
          'PERMITE_ENTREGA'
        ]);
        
      if (configData) {
        const graficaConfig = configData.find(item => item.key === 'GRAFICA_ENDERECO');
        const aciescConfig = configData.find(item => item.key === 'ACIESC_ENDERECO');
        const permiteRetiradaConfig = configData.find(item => item.key === 'PERMITE_RETIRADA');
        const permiteEntregaConfig = configData.find(item => item.key === 'PERMITE_ENTREGA');
        
        if (graficaConfig) setGraficaEndereco(graficaConfig.value);
        if (aciescConfig) setAciescEndereco(aciescConfig.value);
        if (permiteRetiradaConfig) setPermiteRetirada(permiteRetiradaConfig.value === 'true');
        if (permiteEntregaConfig) setPermiteEntrega(permiteEntregaConfig.value === 'true');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações de carteirinha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveConfig = async () => {
    try {
      setIsLoading(true);
      
      // Save card visual settings first
      if (cardSettings) {
        await updateCarteirinhaConfig({
          vizualizacao: cardSettings
        });
      }
      
      // Then save other configurations
      await updateCarteirinhaConfig({
        fee: carteirinhaFee,
        paymentGateway
      });
      
      // Save additional pickup location settings
      const { error } = await supabase
        .from('system_config')
        .upsert([
          { key: 'GRAFICA_ENDERECO', value: graficaEndereco },
          { key: 'ACIESC_ENDERECO', value: aciescEndereco },
          { key: 'PERMITE_RETIRADA', value: permiteRetirada.toString() },
          { key: 'PERMITE_ENTREGA', value: permiteEntrega.toString() }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de carteirinha foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as configurações de carteirinha.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    isLoading,
    carteirinhaFee,
    setCarteirinhaFee,
    paymentGateway,
    setPaymentGateway,
    graficaEndereco,
    setGraficaEndereco,
    aciescEndereco,
    setAciescEndereco,
    permiteRetirada,
    setPermiteRetirada,
    permiteEntrega,
    setPermiteEntrega,
    cardSettings,
    updateCardSetting,
    previewData,
    saveConfig
  };
};
