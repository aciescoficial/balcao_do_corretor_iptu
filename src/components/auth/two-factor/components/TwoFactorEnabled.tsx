
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck } from 'lucide-react';
import { TwoFactorEnabledProps } from '../types';

export const TwoFactorEnabled = ({ onShowBackupCodes, onDisable }: TwoFactorEnabledProps) => {
  const { toast } = useToast();
  const [isDisabling, setIsDisabling] = useState(false);

  const handleDisable = async () => {
    try {
      setIsDisabling(true);
      await onDisable();
      toast({
        title: "Autenticação de dois fatores desativada",
        description: "Sua conta agora usa apenas senha para login.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao desativar 2FA",
        description: error.message,
      });
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-green-500" />
        <span className="font-medium text-green-600">Autenticação de dois fatores está ativa</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Sua conta está protegida com uma camada extra de segurança. 
        Ao fazer login, você precisará fornecer seu nome de usuário, 
        senha e um código de autenticação do seu aplicativo.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onShowBackupCodes}
        >
          Ver códigos de backup
        </Button>
        
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleDisable}
          disabled={isDisabling}
        >
          {isDisabling ? "Desativando..." : "Desativar autenticação de dois fatores"}
        </Button>
      </div>
    </div>
  );
};
