
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Store } from 'lucide-react';

interface EntregaTabProps {
  permiteEntrega: boolean;
  setPermiteEntrega: (value: boolean) => void;
  permiteRetirada: boolean;
  setPermiteRetirada: (value: boolean) => void;
  graficaEndereco: string;
  setGraficaEndereco: (value: string) => void;
  aciescEndereco: string;
  setAciescEndereco: (value: string) => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
}

const EntregaTab: React.FC<EntregaTabProps> = ({ 
  permiteEntrega, 
  setPermiteEntrega, 
  permiteRetirada, 
  setPermiteRetirada,
  graficaEndereco, 
  setGraficaEndereco, 
  aciescEndereco, 
  setAciescEndereco, 
  saveConfig, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Entrega</CardTitle>
        <CardDescription>Configure as opções de entrega e pontos de retirada das carteirinhas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Opções de Entrega</h3>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="permite-entrega">Permitir entrega no endereço</Label>
              <p className="text-sm text-muted-foreground">
                Quando ativado, os associados poderão optar por receber a carteirinha em seu endereço
              </p>
            </div>
            <Switch
              id="permite-entrega"
              checked={permiteEntrega}
              onCheckedChange={setPermiteEntrega}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="permite-retirada">Permitir retirada pessoal</Label>
              <p className="text-sm text-muted-foreground">
                Quando ativado, os associados poderão optar por retirar a carteirinha pessoalmente
              </p>
            </div>
            <Switch
              id="permite-retirada"
              checked={permiteRetirada}
              onCheckedChange={setPermiteRetirada}
            />
          </div>
        </div>

        {permiteRetirada && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Pontos de Retirada</h3>
            <div className="space-y-2">
              <Label htmlFor="grafica-endereco" className="flex items-center gap-2">
                <Store className="h-4 w-4" /> Endereço da Gráfica Parceira
              </Label>
              <Textarea
                id="grafica-endereco"
                value={graficaEndereco}
                onChange={(e) => setGraficaEndereco(e.target.value)}
                placeholder="Informe o endereço completo da gráfica"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aciesc-endereco" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Endereço da ACIESC
              </Label>
              <Textarea
                id="aciesc-endereco"
                value={aciescEndereco}
                onChange={(e) => setAciescEndereco(e.target.value)}
                placeholder="Informe o endereço completo da sede da ACIESC"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={saveConfig} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Configurações de Entrega'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EntregaTab;
