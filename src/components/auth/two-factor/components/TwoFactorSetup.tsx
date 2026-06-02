
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { verifyTotp } from '../utils/totpUtils';
import { TwoFactorSetupProps } from '../types';

export const TwoFactorSetup = ({ secret, qrCodeUrl, onVerify, onCancel }: TwoFactorSetupProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Código obrigatório",
        description: "Por favor, insira o código de verificação.",
      });
      return;
    }

    try {
      setIsVerifying(true);
      
      // First verify the token locally
      const isValid = verifyTotp(secret, verificationCode);
      
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Código inválido",
          description: "O código inserido não é válido. Tente novamente.",
        });
        setIsVerifying(false);
        return;
      }
      
      // Then proceed with enabling 2FA
      const backupCodes = await onVerify(verificationCode);
      
      toast({
        title: "Autenticação de dois fatores ativada",
        description: "Salve seus códigos de backup em um local seguro.",
      });
      
      return backupCodes;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao ativar 2FA",
        description: error.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="border p-2 bg-white mb-4 inline-block">
          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" width={200} height={200} />}
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="font-mono text-sm break-all bg-muted p-2 rounded">{secret}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verification-code">Código de verificação</Label>
        <Input
          id="verification-code"
          type="text"
          maxLength={6}
          placeholder="000000"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
        />
        <p className="text-xs text-muted-foreground">
          Digite o código de verificação fornecido pelo aplicativo autenticador.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? "Verificando..." : "Verificar e ativar"}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isVerifying}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};
