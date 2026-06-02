
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, BadgePercent, Truck, Palette } from 'lucide-react';
import TaxaTab from './carteirinha/TaxaTab';
import EntregaTab from './carteirinha/EntregaTab';
import VisualTab from './carteirinha/VisualTab';
import { useCarteirinhaConfig } from './carteirinha/useCarteirinhaConfig';

const CarteirinhaConfig = () => {
  const {
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
  } = useCarteirinhaConfig();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Configurações de Carteirinha</h2>
      </div>
      
      <Tabs defaultValue="taxa">
        <TabsList>
          <TabsTrigger value="taxa" className="flex items-center gap-1">
            <BadgePercent className="h-4 w-4" /> Configurações Financeiras
          </TabsTrigger>
          <TabsTrigger value="entrega" className="flex items-center gap-1">
            <Truck className="h-4 w-4" /> Configurações de Entrega
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-1">
            <Palette className="h-4 w-4" /> Personalização Visual
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="taxa" className="pt-4">
          <TaxaTab
            carteirinhaFee={carteirinhaFee}
            setCarteirinhaFee={setCarteirinhaFee}
            paymentGateway={paymentGateway}
            setPaymentGateway={setPaymentGateway}
            saveConfig={saveConfig}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="entrega" className="pt-4">
          <EntregaTab
            permiteEntrega={permiteEntrega}
            setPermiteEntrega={setPermiteEntrega}
            permiteRetirada={permiteRetirada}
            setPermiteRetirada={setPermiteRetirada}
            graficaEndereco={graficaEndereco}
            setGraficaEndereco={setGraficaEndereco}
            aciescEndereco={aciescEndereco}
            setAciescEndereco={setAciescEndereco}
            saveConfig={saveConfig}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="visual" className="pt-4">
          <VisualTab
            cardSettings={cardSettings}
            updateCardSetting={updateCardSetting}
            previewData={previewData}
            saveConfig={saveConfig}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarteirinhaConfig;
