
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaxaTabProps {
  carteirinhaFee: number;
  setCarteirinhaFee: (fee: number) => void;
  paymentGateway: 'asaas' | 'stripe';
  setPaymentGateway: (gateway: 'asaas' | 'stripe') => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
}

const TaxaTab: React.FC<TaxaTabProps> = ({ 
  carteirinhaFee, 
  setCarteirinhaFee,
  paymentGateway,
  setPaymentGateway,
  saveConfig, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Financeiras</CardTitle>
        <CardDescription>Configure os valores e métodos de pagamento para carteirinhas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="carteirinhaFee">Taxa de Carteirinha (R$)</Label>
          <Input 
            id="carteirinhaFee" 
            type="number" 
            step="0.01" 
            min="0"
            value={carteirinhaFee} 
            onChange={(e) => setCarteirinhaFee(parseFloat(e.target.value))}
          />
          <p className="text-sm text-muted-foreground">
            Este valor será cobrado do associado para cada solicitação de carteirinha.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentGateway">Gateway de Pagamento</Label>
          <Select value={paymentGateway} onValueChange={(val) => setPaymentGateway(val as 'asaas' | 'stripe')}>
            <SelectTrigger id="paymentGateway">
              <SelectValue placeholder="Selecione o gateway de pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asaas">Asaas</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Selecione o gateway de pagamento para processamento das taxas de carteirinha.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveConfig} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaxaTab;
