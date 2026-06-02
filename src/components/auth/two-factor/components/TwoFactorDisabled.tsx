
import { Button } from '@/components/ui/button';
import { ShieldAlert, QrCode } from 'lucide-react';
import { TwoFactorDisabledProps } from '../types';

export const TwoFactorDisabled = ({ onSetup }: TwoFactorDisabledProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-amber-500" />
        <span className="font-medium text-amber-600">Autenticação de dois fatores está desativada</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        A autenticação de dois fatores adiciona uma camada extra de segurança à sua conta.
        Além de sua senha, você precisará inserir um código gerado por um aplicativo autenticador.
      </p>

      <div className="flex items-center gap-3 mt-2">
        <QrCode className="h-10 w-10 text-muted-foreground" />
        <div>
          <h4 className="text-sm font-medium">Aplicativo autenticador</h4>
          <p className="text-xs text-muted-foreground">
            Configure a autenticação de dois fatores usando Google Authenticator, 
            Microsoft Authenticator ou outro aplicativo autenticador.
          </p>
        </div>
      </div>

      <Button onClick={onSetup}>
        Configurar autenticação de dois fatores
      </Button>
    </div>
  );
};
