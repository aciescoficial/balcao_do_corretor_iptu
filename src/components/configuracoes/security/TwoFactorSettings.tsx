
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { KeyRound, ShieldCheck, Info, Settings } from 'lucide-react';
import { useAuth } from '@/components/auth';
import { useToast } from '@/hooks/use-toast';

const TwoFactorSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleGlobalTwoFactor = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      // Simulando uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEnabled(enabled);
      
      toast({
        title: enabled ? "Autenticação de 2 fatores habilitada" : "Autenticação de 2 fatores desabilitada",
        description: enabled 
          ? "A autenticação de 2 fatores foi habilitada para todos os usuários." 
          : "A autenticação de 2 fatores foi desabilitada para todos os usuários.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível alterar a configuração da autenticação de 2 fatores.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Configuração da Autenticação de 2 Fatores</h2>
          <p className="text-muted-foreground">
            Configure a autenticação de dois fatores para aumentar a segurança do sistema.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Autenticação de 2 Fatores Global
          </CardTitle>
          <CardDescription>
            Configurações globais para autenticação de dois fatores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Habilitar para todos os usuários</div>
              <div className="text-sm text-muted-foreground">
                Quando ativado, todos os usuários serão obrigados a configurar a autenticação de 2 fatores.
              </div>
            </div>
            <Switch
              checked={isEnabled}
              disabled={isLoading}
              onCheckedChange={toggleGlobalTwoFactor}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Métodos de Autenticação
          </CardTitle>
          <CardDescription>
            Configure quais métodos de autenticação de 2 fatores estarão disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Aplicativo Autenticador (TOTP)</div>
                <div className="text-sm text-muted-foreground">
                  Autenticação via aplicativos como Google Authenticator, Authy, etc.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">SMS (Mensagens de Texto)</div>
                <div className="text-sm text-muted-foreground">
                  Envio de códigos de autenticação por SMS.
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">E-mail</div>
                <div className="text-sm text-muted-foreground">
                  Envio de códigos de autenticação por e-mail.
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Códigos de Backup</div>
                <div className="text-sm text-muted-foreground">
                  Permitir que usuários gerem códigos de backup para emergências.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Lembrar Dispositivo</div>
                <div className="text-sm text-muted-foreground">
                  Permitir que os usuários sejam lembrados em dispositivos confiáveis.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Período de Lembrete (dias)</div>
                <div className="text-sm text-muted-foreground">
                  Por quantos dias um dispositivo será lembrado após a autenticação.
                </div>
              </div>
              <div className="w-20">
                <input 
                  type="number" 
                  className="w-full p-2 border rounded" 
                  min="1" 
                  max="90" 
                  defaultValue="30" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Após habilitar a autenticação de 2 fatores, os usuários precisarão configurá-la no próximo login. 
          Certifique-se de que todos os usuários estão informados sobre esta mudança.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end">
        <Button>Salvar Configurações</Button>
      </div>
    </div>
  );
};

export default TwoFactorSettings;
