
import React, { useState } from 'react';
import { MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { EnderecoEntregaForm } from './carteirinha/EnderecoEntregaForm';
import { TaxaEntregaCard } from './carteirinha/TaxaEntregaCard';
import { useCarteirinhaSolicitacao } from './carteirinha/useCarteirinhaSolicitacao';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const SolicitarCarteirinhaPage = () => {
  const [entregaMethod, setEntregaMethod] = useState<'retirada' | 'entrega'>('retirada');
  const [retiradaLocation, setRetiradaLocation] = useState<'grafica' | 'aciesc'>('grafica');
  const { toast } = useToast();
  
  const {
    userData,
    taxaEntrega,
    isLoading,
    handleSubmit,
    getDefaultValues
  } = useCarteirinhaSolicitacao({
    navigateToPayment: (url) => window.location.href = url,
    entregaMethod,
    retiradaLocation
  });

  const handleEntregaMethodChange = (value: string) => {
    setEntregaMethod(value as 'retirada' | 'entrega');
  };

  const handleRetiradaLocationChange = (value: string) => {
    setRetiradaLocation(value as 'grafica' | 'aciesc');
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Solicitar Carteirinha</h1>
      
      <div className="wp-card">
        <h2 className="text-xl font-semibold mb-4">Solicitar Nova Carteirinha</h2>
        <p className="mb-6 text-muted-foreground">
          Para solicitar sua nova carteirinha, escolha o método de entrega, confirme seus dados e efetue o pagamento da taxa.
        </p>
        
        <Tabs defaultValue="entrega" className="mb-6">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="entrega" className="flex-1 flex items-center gap-2">
              <Truck className="h-4 w-4" /> Método de Entrega
            </TabsTrigger>
            <TabsTrigger value="pagamento" className="flex-1 flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Pagamento
            </TabsTrigger>
            <TabsTrigger value="confirmacao" className="flex-1 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Confirmação
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="entrega" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Método de Entrega</CardTitle>
                <CardDescription>Escolha como deseja receber sua carteirinha</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  defaultValue="retirada" 
                  value={entregaMethod}
                  onValueChange={handleEntregaMethodChange}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="retirada" id="retirada" />
                    <Label htmlFor="retirada" className="flex-1 cursor-pointer">
                      <div className="font-medium">Retirar Pessoalmente</div>
                      <div className="text-sm text-muted-foreground">Sem custo adicional</div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="entrega" id="entrega" />
                    <Label htmlFor="entrega" className="flex-1 cursor-pointer">
                      <div className="font-medium">Entrega no Endereço</div>
                      <div className="text-sm text-muted-foreground">Taxa adicional de entrega</div>
                    </Label>
                  </div>
                </RadioGroup>

                {entregaMethod === 'retirada' && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-3">Local de Retirada</h3>
                    <RadioGroup 
                      defaultValue="grafica" 
                      value={retiradaLocation}
                      onValueChange={handleRetiradaLocationChange}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="grafica" id="grafica" />
                        <Label htmlFor="grafica" className="flex-1 cursor-pointer">
                          <div className="font-medium">Gráfica Parceira</div>
                          <div className="text-sm text-muted-foreground">Rua das Impressões, 123</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="aciesc" id="aciesc" />
                        <Label htmlFor="aciesc" className="flex-1 cursor-pointer">
                          <div className="font-medium">Sede da ACIESC</div>
                          <div className="text-sm text-muted-foreground">Avenida Principal, 456</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mb-6">
              <TaxaEntregaCard valor={entregaMethod === 'entrega' ? taxaEntrega : 0} />
            </div>
            
            {entregaMethod === 'entrega' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-lg">Endereço de Entrega</h3>
                </div>
                
                <EnderecoEntregaForm
                  defaultValues={getDefaultValues()}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            )}
            
            {entregaMethod === 'retirada' && (
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSubmit({
                    ...getDefaultValues(),
                    confirmarEndereco: true
                  })}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pagamento">
            <Card>
              <CardHeader>
                <CardTitle>Pagamento</CardTitle>
                <CardDescription>A página de pagamento será exibida após confirmar seus dados</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
          
          <TabsContent value="confirmacao">
            <Card>
              <CardHeader>
                <CardTitle>Confirmação</CardTitle>
                <CardDescription>Sua solicitação será confirmada após o pagamento</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SolicitarCarteirinhaPage;
