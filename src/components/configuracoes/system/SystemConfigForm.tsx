
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSystemConfig } from './hooks/useSystemConfig';
import { toast } from '@/components/ui/use-toast';

export const SystemConfigForm = () => {
  const { configValues, isLoading, saveConfig } = useSystemConfig();
  const [showSystemMessages, setShowSystemMessages] = useState(true);

  // Load the current value from configValues when available
  useEffect(() => {
    if (configValues && !isLoading) {
      const currentValue = configValues['SHOW_SYSTEM_MESSAGES'];
      setShowSystemMessages(currentValue ? currentValue === 'true' : true);
    }
  }, [configValues, isLoading]);

  const handleToggleSystemMessages = async (checked: boolean) => {
    try {
      await saveConfig('SHOW_SYSTEM_MESSAGES', checked.toString());
      setShowSystemMessages(checked);
      
      // Store in localStorage for immediate effect
      try {
        const existingConfig = localStorage.getItem('systemConfig');
        const config = existingConfig ? JSON.parse(existingConfig) : {};
        localStorage.setItem('systemConfig', JSON.stringify({
          ...config,
          showSystemMessages: checked
        }));
      } catch (e) {
        console.error('Error updating systemConfig in localStorage:', e);
      }
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(
        new CustomEvent('system-config-updated', { 
          detail: { showSystemMessages: checked } 
        })
      );

      toast({
        title: "Configuração atualizada",
        description: checked 
          ? "Mensagens de sistema ativadas" 
          : "Mensagens de sistema desativadas",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="system-messages"
            checked={showSystemMessages}
            onCheckedChange={handleToggleSystemMessages}
            disabled={isLoading}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:hover:bg-green-600"
          />
          <Label htmlFor="system-messages">
            Exibir mensagens importantes no dashboard
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Quando ativado, mensagens importantes serão exibidas no topo do dashboard.
        </p>
      </CardContent>
    </Card>
  );
};
