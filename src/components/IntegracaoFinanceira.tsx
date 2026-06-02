
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GoHighLevelIntegracao from './integracao/GoHighLevelIntegracao';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const IntegracaoFinanceira: React.FC = () => {
  const [asaasApiKey, setAsaasApiKey] = useState('');
  const [stripeApiKey, setStripeApiKey] = useState('');
  const [isTestMode, setIsTestMode] = useState(true);
  const [isStripeTestMode, setIsStripeTestMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('asaas');
  const { toast } = useToast();

  useEffect(() => {
    // Carregar configurações existentes
    const loadConfig = async () => {
      try {
        const { data } = await supabase
          .from('system_config')
          .select('*')
          .in('key', [
            'ASAAS_API_KEY',
            'ASAAS_ENV',
            'STRIPE_SECRET_KEY',
            'STRIPE_ENV'
          ]);
          
        if (data) {
          const asaasKey = data.find(item => item.key === 'ASAAS_API_KEY');
          const asaasEnv = data.find(item => item.key === 'ASAAS_ENV');
          const stripeKey = data.find(item => item.key === 'STRIPE_SECRET_KEY');
          const stripeEnv = data.find(item => item.key === 'STRIPE_ENV');
          
          if (asaasKey) setAsaasApiKey(asaasKey.value);
          if (asaasEnv) setIsTestMode(asaasEnv.value === 'sandbox');
          if (stripeKey) setStripeApiKey(stripeKey.value);
          if (stripeEnv) setIsStripeTestMode(stripeEnv.value === 'test');
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };
    
    loadConfig();
  }, []);

  const saveAsaasConfig = async () => {
    if (!asaasApiKey) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor insira a chave API do Asaas.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Try to update key if it exists
      let { data: existingConfig } = await supabase
        .from('system_config')
        .select('*')
        .eq('key', 'ASAAS_API_KEY')
        .maybeSingle();
      
      if (existingConfig) {
        await supabase
          .from('system_config')
          .update({ value: asaasApiKey })
          .eq('key', 'ASAAS_API_KEY');
      } else {
        await supabase
          .from('system_config')
          .insert({ key: 'ASAAS_API_KEY', value: asaasApiKey });
      }
      
      // Save environment mode
      let { data: existingMode } = await supabase
        .from('system_config')
        .select('*')
        .eq('key', 'ASAAS_ENV')
        .maybeSingle();
      
      const modeValue = isTestMode ? 'sandbox' : 'production';
      
      if (existingMode) {
        await supabase
          .from('system_config')
          .update({ value: modeValue })
          .eq('key', 'ASAAS_ENV');
      } else {
        await supabase
          .from('system_config')
          .insert({ key: 'ASAAS_ENV', value: modeValue });
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do Asaas foram salvas com sucesso."
      });
      
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveStripeConfig = async () => {
    if (!stripeApiKey) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor insira a chave API do Stripe.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Try to update key if it exists
      let { data: existingConfig } = await supabase
        .from('system_config')
        .select('*')
        .eq('key', 'STRIPE_SECRET_KEY')
        .maybeSingle();
      
      if (existingConfig) {
        await supabase
          .from('system_config')
          .update({ value: stripeApiKey })
          .eq('key', 'STRIPE_SECRET_KEY');
      } else {
        await supabase
          .from('system_config')
          .insert({ key: 'STRIPE_SECRET_KEY', value: stripeApiKey });
      }
      
      // Save environment mode
      let { data: existingMode } = await supabase
        .from('system_config')
        .select('*')
        .eq('key', 'STRIPE_ENV')
        .maybeSingle();
      
      const modeValue = isStripeTestMode ? 'test' : 'live';
      
      if (existingMode) {
        await supabase
          .from('system_config')
          .update({ value: modeValue })
          .eq('key', 'STRIPE_ENV');
      } else {
        await supabase
          .from('system_config')
          .insert({ key: 'STRIPE_ENV', value: modeValue });
      }
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do Stripe foram salvas com sucesso."
      });
      
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Integrações</h1>
      
      <Tabs defaultValue="asaas" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="asaas">Asaas</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="gohighlevel">Go High Level</TabsTrigger>
        </TabsList>
        
        <TabsContent value="asaas" className="space-y-6 mt-4">
          <div className="wp-card">
            <h2 className="text-xl font-semibold mb-4">Integração Asaas</h2>
            <p className="mb-4">A integração com o Asaas permite gerenciar cobranças e assinaturas dos conveniados.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asaasApiKey">Chave de API do Asaas</Label>
                <Input 
                  id="asaasApiKey" 
                  value={asaasApiKey} 
                  onChange={(e) => setAsaasApiKey(e.target.value)}
                  placeholder="$aact_YnJpZGdlLWFjY291bnQtdG9rZW4..."
                  type="password"
                />
                <p className="text-xs text-gray-500">
                  Encontre sua chave API no painel Asaas: Configurações &gt; Integrações &gt; API
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="testMode" 
                  checked={isTestMode} 
                  onChange={() => setIsTestMode(true)}
                  className="w-4 h-4"
                />
                <Label htmlFor="testMode">Ambiente de Testes (Sandbox)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="prodMode" 
                  checked={!isTestMode} 
                  onChange={() => setIsTestMode(false)}
                  className="w-4 h-4"
                />
                <Label htmlFor="prodMode">Ambiente de Produção</Label>
              </div>
              
              <Button onClick={saveAsaasConfig} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar configurações"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stripe" className="space-y-6 mt-4">
          <div className="wp-card">
            <h2 className="text-xl font-semibold mb-4">Integração Stripe</h2>
            <p className="mb-4">A integração com o Stripe permite processar pagamentos por cartão de crédito e outros métodos.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeApiKey">Chave Secreta do Stripe</Label>
                <Input 
                  id="stripeApiKey" 
                  value={stripeApiKey} 
                  onChange={(e) => setStripeApiKey(e.target.value)}
                  placeholder="sk_test_..."
                  type="password"
                />
                <p className="text-xs text-gray-500">
                  Encontre sua chave API no painel Stripe: Desenvolvedores &gt; Chaves de API
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="stripeTestMode" 
                  checked={isStripeTestMode} 
                  onChange={() => setIsStripeTestMode(true)}
                  className="w-4 h-4"
                />
                <Label htmlFor="stripeTestMode">Ambiente de Testes</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="stripeProdMode" 
                  checked={!isStripeTestMode} 
                  onChange={() => setIsStripeTestMode(false)}
                  className="w-4 h-4"
                />
                <Label htmlFor="stripeProdMode">Ambiente de Produção</Label>
              </div>
              
              <Button onClick={saveStripeConfig} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar configurações"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="gohighlevel" className="space-y-6 mt-4">
          <div className="wp-card">
            <GoHighLevelIntegracao />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegracaoFinanceira;
