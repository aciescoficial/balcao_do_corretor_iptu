
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, RefreshCw } from 'lucide-react';
import { BackupCodesProps } from '../types';

export const BackupCodes = ({ backupCodes, onRegenerate, onBack }: BackupCodesProps) => {
  const { toast } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast({
      title: "Códigos copiados",
      description: "Os códigos de backup foram copiados para a área de transferência.",
    });
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      await onRegenerate();
      toast({
        title: "Códigos regenerados",
        description: "Novos códigos de backup foram gerados.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao regenerar códigos",
        description: error.message,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertDescription className="text-amber-800">
          Guarde estes códigos de backup em um local seguro. Eles podem ser usados uma única vez caso você 
          perca acesso ao seu aplicativo de autenticação.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-2 my-3">
        {backupCodes.map((code, index) => (
          <div key={index} className="p-2 bg-muted rounded-md border text-center font-mono">
            {code}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={copyBackupCodes}
          className="flex items-center gap-1"
        >
          <Copy className="h-4 w-4" />
          Copiar códigos
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          className="flex items-center gap-1"
          disabled={isRegenerating}
        >
          <RefreshCw className="h-4 w-4" />
          {isRegenerating ? "Regenerando..." : "Regenerar códigos"}
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onBack}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
};
